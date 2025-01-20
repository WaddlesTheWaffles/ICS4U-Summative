import styles from './LoginView.module.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import HeaderSection from "../Components/HeaderSection";
import { Map } from 'immutable';

function LoginView() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { cart, setCart } = useStoreContext();
    const { setCurrentUser, setUserGenreList, setPreviousPurchaseHistory } = useStoreContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const genreList = [ //temporary genre list for when the user creates an account with google in login
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

    async function signInWithEmail() {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(user.user);
            localStorage.setItem('user', JSON.stringify(auth.currentUser));

            const docRef = doc(firestore, 'users', auth.currentUser.uid);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const userInfo = docSnapshot.data();
                localStorage.setItem('genrePreference', JSON.stringify(userInfo.genreList));
                localStorage.setItem('previousPurchaseHistory', JSON.stringify(userInfo.previousPurchaseHistory));
                setUserGenreList(userInfo.genreList);
                setPreviousPurchaseHistory(Map(userInfo.previousPurchaseHistory));
            } else {
                console.error("Document does not exist");
            }

            setCart(cart.clear());
            navigate('/movies');
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('Invalid email');
                    break;
                case 'auth/user-not-found':
                    alert('No account connected with this email found');
                    break;
                case 'auth/wrong-password':
                    alert('Incorrect password');
                    break;
                case 'too-many-requests':
                    alert('Too many login attempts, please try again later');
                    break;
                case 'auth/network-request-failed':
                    alert('Network error, please try again later');
                    break;
                default:
                    alert('Unknown error, please try again later');
                    break;
            }
        }
    }

    async function signInWithGoogle() {

        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setCurrentUser(auth.currentUser);
            localStorage.setItem('user', JSON.stringify(auth.currentUser));



            setCart(cart.clear());
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
                    break;
                case 'auth/account-exists-with-different-credential':
                    alert('This email is already in use with a different provider');
                    break;
                default:
                    console.error(error.code);
                    console.error(error.message);
                    alert('An error has occured with sign in, please try again later');
                    break;
            }
        }

    }

    return (
        <div>
            <HeaderSection />
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Login</h1>
                <form className={styles.form} onSubmit={(event) => { event.preventDefault(); signInWithEmail(); }}>
                    <label className={styles.boxLabels}>Email:</label>
                    <input required className={styles.infoBoxes} type="text" value={email} onChange={(event) => { setEmail(String(event.target.value)) }} />
                    <label className={styles.boxLabels}>Password:</label>
                    <input required className={styles.infoBoxes} type="password" value={password} onChange={(event) => { setPassword(String(event.target.value)) }} />
                    <input className={styles.loginButton} type="submit" value={"Login"} />

                    <button className='googleLoginButton' onClick={(event) => { event.preventDefault(); signInWithGoogle() }}>Login With Google</button>
                </form>
            </div>
        </div>
    );
}

export default LoginView;