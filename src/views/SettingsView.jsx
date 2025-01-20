import styles from './SettingsView.module.css'
import HeaderSection from "../Components/HeaderSection";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateProfile, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from "../firebase";
import { set } from 'immutable';

function SettingsView() {

    const navigate = useNavigate();
    const auth = getAuth();
    const { accountList, setAccountList, currentUser, setCurrentUser, userGenreList, setUserGenreList } = useStoreContext();
    const [userData, setUserData] = useState(null);
    const [signInMethod, setSignInMethod] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(firestore, 'users', auth.currentUser.uid);
                    const docSnapshot = await getDoc(docRef);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        setUserData(data);
                        setChosenGenreList(data.genreList || []);
                        if (data.signInMethod === 'email') {
                            setSignInMethod('email');
                            setFirstName(data.firstName);
                            setLastName(data.lastName);
                        } else {
                            setSignInMethod('google');
                            setFirstName((auth.currentUser).displayName.split(' ')[0]);
                            setLastName((auth.currentUser).displayName.split(' ')[1]);
                        }
                    } else {
                        console.log("Document does not exist");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    alert('Error fetching user data. Please try again later.');
                }
            };
            fetchUserData();
        }
    }, [auth.currentUser]);

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

    const [email, setEmail] = useState((auth.currentUser).email);
    const [password, setPassword] = useState(undefined);

    try {
        const testNameSplit = (auth.currentUser).displayName.split(' ');
    } catch (error) {
        alert('There is no display Name availble')
    }
    const nameSplit = (auth.currentUser).displayName.split(' ');


    const [chosenGenreList, setChosenGenreList] = useState(userGenreList);

    function renderCheckboxes() {
        return totalGenreList.map((genre) => (
            <div key={genre.id} className={styles.labelCheckboxPair}>
                <label htmlFor={(genre.genreName).toLowerCase() + "Genre"} >{genre.genreName}</label>
                {chosenGenreList.some(item => item.id === genre.id)
                    ? <input checked type="checkbox" id={(genre.genreName).toLowerCase() + "Genre"} onChange={(event) => { event.target.checked ? addGenreToList(genre) : removeGenreFromList(genre) }} />
                    : <input type="checkbox" id={(genre.genreName).toLowerCase() + "Genre"} onChange={(event) => { event.target.checked ? addGenreToList(genre) : removeGenreFromList(genre) }} />
                }
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

    async function applyChangesEmail() {

        const verifyPassword = async (currentUser, enteredPassword) => {
            try {
                // Check if the user is authenticated before proceeding
                if (!currentUser) {
                    throw new Error("User not authenticated");
                }
        
                const credential = EmailAuthProvider.credential(currentUser.email, enteredPassword);
                
                // Attempt to reauthenticate with the provided credentials
                await reauthenticateWithCredential(currentUser, credential);
                
                console.log("Password matches! User successfully reauthenticated.");
                return true; // Password is correct
            } catch (error) {
                if (error.code === "auth/wrong-password") {
                    console.error("The entered password is incorrect.");
                } else if (error.code === "auth/invalid-credential") {
                    console.error("Invalid credentials provided. Please check the email and password.");
                } else {
                    alert('Error during reauthentication. Please try again later.');
                    console.error("Error during reauthentication:", error);
                }
                return false; // Password does not match
            }
        };
        
        if (chosenGenreList.length < 10) {
            alert('Please choose a minimum 10 genres');
        } else {
            if (password === undefined) {
                // Do nothing: user doesn't want to change password
            } else {
                if (password.length >= 6) {
                    const isPasswordValid = await verifyPassword(auth.currentUser, password);
                    if (isPasswordValid) {
                        alert('New password cannot be the same as the old password');
                        return;
                    } else {
                        await updatePassword(auth.currentUser, password);
                    }
                } else {
                    alert('Password must be at least 6 characters long');
                    return;
                }
            }
        }

            await updateProfile(auth.currentUser, {
                displayName: firstName + ' ' + lastName
            }).then(() => {
                localStorage.setItem('user', JSON.stringify(auth.currentUser));
                setCurrentUser(auth.currentUser);
                localStorage.setItem('genrePreference', JSON.stringify(chosenGenreList));
                setUserGenreList(chosenGenreList);

                const docRef = doc(firestore, 'users', (auth.currentUser).uid);
                updateDoc(docRef, {
                    genreList: chosenGenreList,
                    firstName: firstName,
                    lastName: lastName
                });

                alert("Settings have been saved.");
            }).catch((error) => {
                console.error("Error updating user profile:", error);
                alert('Error updating user profile. Please try again later.');
            });



        }

    function applyChangesGoogle() {

        if (chosenGenreList.length < 10) {
            alert('Please choose a minimum 10 genres')
        } else {
            localStorage.setItem('genrePreference', JSON.stringify(chosenGenreList));
            setUserGenreList(chosenGenreList);

            const docRef = doc(firestore, 'users', (auth.currentUser).uid);
            updateDoc(docRef, {
                genreList: chosenGenreList,
            });

            alert("Settings have been saved.");
        }
    }

    if (!signInMethod) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <HeaderSection />
            <h1 className={styles.pageTitle} >Settings</h1>

            {signInMethod === 'email' ? (
                <form className={styles.settingsForm} onSubmit={(event) => { event.preventDefault(); applyChangesEmail(); }}>
                    <div className={styles.accountInfo}>
                        <h2 className={styles.infoTitle} >Account Info</h2>
                        <label className={styles.settingsBoxLabel} >First Name</label>
                        <input required className={styles.settingsInfoBox} type="text" value={firstName} onChange={(event) => { setFirstName(String(event.target.value)) }} />
                        <label className={styles.settingsBoxLabel} >Last Name</label>
                        <input required className={styles.settingsInfoBox} type="text" value={lastName} onChange={(event) => { setLastName(String(event.target.value)) }} />
                        <label className={styles.settingsBoxLabel} >Change Password</label>
                        <input className={styles.settingsInfoBox} type="text" value={password} onChange={(event) => { setPassword(String(event.target.value)) }} />
                        <label className={styles.settingsBoxLabel} >Email</label>
                        <input disabled className={styles.settingsInfoBox} type="text" value={email} />
                    </div>

                    <div className={styles.genresSelection} >
                        <h2 className={styles.genreTitle} >Genres Selected</h2>
                        {renderCheckboxes()}
                    </div>

                    <button className={styles.applyButton} type="submit" >Apply Settings</button>
                    <button className={styles.backButtonSettings} type="button" onClick={() => navigate('/movies')}>Back</button>
                </form>
            ) : (

                <form className={styles.settingsForm} onSubmit={(event) => { event.preventDefault(); applyChangesGoogle(); }}>
                    <div className={styles.accountInfo}>
                        <h2 className={styles.infoTitle} >Account Info</h2>
                        <label className={styles.settingsBoxLabel} >First Name</label>
                        <input disabled className={styles.settingsInfoBox} type="text" value={firstName} onChange={(event) => { setFirstName(String(event.target.value)) }} />
                        <label className={styles.settingsBoxLabel} >Last Name</label>
                        <input disabled className={styles.settingsInfoBox} type="text" value={lastName} onChange={(event) => { setLastName(String(event.target.value)) }} />
                        <label className={styles.settingsBoxLabel} >Email</label>
                        <input disabled className={styles.settingsInfoBox} type="text" value={email} />
                    </div>

                    <div className={styles.genresSelection} >
                        <h2 className={styles.genreTitle} >Genres Selected</h2>
                        {renderCheckboxes()}
                    </div>

                    <button className={styles.applyButton} type="submit" >Apply Settings</button>
                    <button className={styles.backButtonSettings} type="button" onClick={() => navigate('/movies')}>Back</button>
                </form>
            )}
        </div >
    )
}

export default SettingsView