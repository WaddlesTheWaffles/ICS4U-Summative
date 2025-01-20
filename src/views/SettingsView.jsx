import styles from './SettingsView.module.css'
import HeaderSection from "../Components/HeaderSection";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateProfile, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from "../firebase";
import { get, update } from 'immutable';
import { use } from 'react';

function SettingsView() {

    const navigate = useNavigate();
    const auth = getAuth();
    const { accountList, setAccountList, currentUser, setCurrentUser, userGenreList, setUserGenreList } = useStoreContext();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(firestore, 'users', (auth.currentUser).uid);
                    const docSnapshot = await getDoc(docRef);
                    if (docSnapshot.exists()) {
                        setUserData(docSnapshot.data());
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
    const [firstName, setFirstName] = useState(nameSplit[0]);
    const [lastName, setLastName] = useState(nameSplit[1]);

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

    async function applyChanges() {

        const verifyPassword = async (currentUser, enteredPassword) => {
            try {
                const credential = EmailAuthProvider.credential(currentUser.email, enteredPassword);
                await reauthenticateWithCredential(currentUser, credential);

                console.log("Password matches! User successfully reauthenticated.");
                return true; // Password is correct
            } catch (error) {
                if (error.code === "auth/wrong-password") {
                    console.error("The entered password is incorrect.");
                } else {
                    alert('Error during reauthentication. Please try again later.');
                    console.error("Error during reauthentication:", error);
                }
                return false;
            }
        }

        if (chosenGenreList.length < 10) {
            alert('Please choose minimum 10 genres')
        } else {

            if (password === undefined) {
                //do nothing user doesnt want to change password
            } else {
                if (password.length >= 6) {
                    if (verifyPassword(auth.currentUser, password)) {
                        alert('New password cannot be the same as the old password')
                    } else {
                        await updatePassword(auth.currentUser, password)
                    }
                } else {
                    alert('Password must be at least 6 characters long')
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
    }
    //use userData.signInMethod to check if user is signed in with google or email
    return (
        <div>
            <HeaderSection />
            <h1 className={styles.pageTitle} >Settings</h1>
            <form className={styles.settingsForm} onSubmit={(event) => { event.preventDefault(); applyChanges(); }}>
                <div className={styles.accountInfo} >
                    <h2 className={styles.infoTitle} >Account Info</h2>
                    <label className={styles.settingsBoxLabel} >First Name</label>
                    <input required className={styles.settingsInfoBox} type="text" value={firstName} onChange={(event) => { setFirstName(String(event.target.value)) }} />
                    <label className={styles.settingsBoxLabel} >Last Name</label>
                    <input required className={styles.settingsInfoBox} type="text" value={lastName} onChange={(event) => { setLastName(String(event.target.value)) }} />
                    <label className={styles.settingsBoxLabel} >Change Password</label>
                    <input className={styles.settingsInfoBox} type="text" value={password} />
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
        </div>
    )
}

export default SettingsView