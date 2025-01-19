import styles from './LoginView.module.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import HeaderSection from "../Components/HeaderSection";

function LoginView() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { cart, setCart } = useStoreContext();
    const { accountList, setAccountList } = useStoreContext();
    const { currentUser, setCurrentUser } = useStoreContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signInWithEmail() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
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
                </form>
            </div>
        </div>
    );
}

export default LoginView;