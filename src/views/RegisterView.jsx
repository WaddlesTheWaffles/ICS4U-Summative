import styles from './RegisterView.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from "../firebase";
import HeaderSection from "../Components/HeaderSection";

function RegisterView() {

    const auth = getAuth();
    const navigate = useNavigate();
    const { allGenreList, setAllGenreList, accountList, setAccountList, currentUser, setCurrentUser } = useStoreContext();

    const totalGenreList = [
        { "genreName": "Action", "id": 28 },
        { "genreName": "Adventure", "id": 12 },
        { "genreName": "Animation", "id": 16 },
        { "genreName": "Comedy", "id": 35 },
        { "genreName": "Crime", "id": 80 },
        { "genreName": "Family", "id": 10751 },
        { "genreName": "Fantasy", "id": 14 },
        { "genreName": "History", "id": 36 },
        { "genreName": "Horror", "id": 27 },
        { "genreName": "Music", "id": 10402 },
        { "genreName": "Mystery", "id": 9648 },
        { "genreName": "Sci-Fi", "id": 878 },
        { "genreName": "Thriller", "id": 53 },
        { "genreName": "War", "id": 10752 },
        { "genreName": "Western", "id": 37 }
    ];
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [chosenGenreList, setChosenGenreList] = useState([]);

    async function registerByEmail() {

        if (password != rePassword) {
            alert('Passwords do not match');
            return;
        }
        if (chosenGenreList.length < 10) {
            alert('Please choose at least ten genre');
            return;
        }

        try {
            const user = (await createUserWithEmailAndPassword(auth, email, password)).user
            await updateProfile(user, { displayName: `${firstName} ${lastName}` })
            setCurrentUser(auth.currentUser);

            await setDoc(doc(firestore, 'users', user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                genreList: chosenGenreList,
                signInMethod: 'email',
                previousPerchaseHistory: []
            })

            localStorage.setItem('user', JSON.stringify(auth.currentUser));

            setAllGenreList((prevList) => prevList.set(email, chosenGenreList)); //delete this line when db is implemented
            navigate('/movies');
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('Email already in use');
                    break;
                case 'auth/invalid-email':
                    alert('Invalid email');
                    break;
                case 'auth/weak-password':
                    alert('Password is too weak, 6+ characters required');
                    break;
                case "auth/too-many-requests":
                    alert('Too many attempts. Please try again later.');
                    break;
                case "auth/network-request-failed":
                    alert('Network error. Please check your connection.');
                    break;
                default:
                    alert('An error occurred');
                    console.error(error.code);
                    console.error(error.message);
                    break;
            }
        }
    }

    async function registerByGoogle() {
        event.preventDefault();
        if (chosenGenreList.length < 10) {
            alert('Please choose at least ten genre');
            return;
        }

        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setCurrentUser(auth.currentUser);

            await setDoc(doc(firestore, 'users', user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                genreList: chosenGenreList,
                signInMethod: 'google',
                previousPerchaseHistory: []
            })

            navigate('/movies');
        } catch (error) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    alert('Popup closed by user');
                    break;
                case 'auth/cancelled-popup-request':
                    alert('Popup request cancelled');
                    break;
                case 'auth/popup-blocked':
                    alert('Popup blocked by browser');
                case 'auth/account-exists-with-different-credential':
                    alert('This email is already in use with a different provider');
                    break;
            }
        }


    }

    function renderCheckboxes() {
        return totalGenreList.map((genre) => (
            <div key={genre.id} className={styles.checkBoxLabelPair}>
                <label htmlFor={(genre.genreName).toLowerCase() + "Genre"} >{genre.genreName}</label>
                <input type="checkbox" id={(genre.genreName).toLowerCase() + "Genre"} onChange={(event) => { event.target.checked ? addGenreToList(genre) : removeGenreFromList(genre) }} />
            </div>
        ))
    }

    function addGenreToList(genreObject) {
        setChosenGenreList(prevList => {
            if (prevList.find(item => item.genreName === genreObject.genreName)) {
                alert('Genre has already been added to the list');
                return prevList;
            }
            return [...prevList, genreObject];
        });
    }

    function removeGenreFromList(genreObject) {
        setChosenGenreList(prevList => {
            if (!prevList.find(item => item.genreName === genreObject.genreName)) {
                alert('Genre is not in the list');
                return prevList;
            }
            return prevList.filter(item => item.genreName !== genreObject.genreName);
        });
    }

    return (
        <div>
            <HeaderSection />
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Register</h1>
                <form className={styles.form} onSubmit={() => { event.preventDefault(); registerByEmail() }} >
                    <label className={styles.boxLabels} htmlFor="firstNameInfoBox" >First Name:</label>
                    <input required className={styles.infoBoxes} type="text" value={firstName} onChange={(event) => { setFirstName(String(event.target.value)) }} />
                    <label className={styles.boxLabels} htmlFor="lastNameInfoBox" >Last Name:</label>
                    <input required className={styles.infoBoxes} type="text" value={lastName} onChange={(event) => { setLastName(String(event.target.value)) }} />
                    <label className={styles.boxLabels} htmlFor="emailInfoBox" >Email:</label>
                    <input required className={styles.infoBoxes} type="text" value={email} onChange={(event) => { setEmail(String(event.target.value)) }} />
                    <label className={styles.boxLabels} htmlFor="passwordInfoBox" >Pasword:</label>
                    <input required className={styles.infoBoxes} type="password" value={password} onChange={(event) => { setPassword(String(event.target.value)) }} />
                    <label className={styles.boxLabels} htmlFor="rePasswordInfoBox" >Re-enter Password:</label>
                    <input required className={styles.infoBoxes} type="password" value={rePassword} onChange={(event) => { setRePassword(String(event.target.value)) }} />

                    <div className={styles.genreCheckList}>
                        {renderCheckboxes()}
                    </div>

                    <input className={styles.registerButton} type="submit" value={"Register"} />
                    <button className='googleRegisterButton' onClick={(event) => { event.preventDefault(); registerByGoogle(); }}>Register With Google</button>
                </form>
            </div>
        </div >
    )
}

export default RegisterView