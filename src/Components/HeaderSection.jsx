import styles from './HeaderSection.module.css';
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";

function HeaderSection() {

    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useStoreContext();

    function logout() {
        setCurrentUser({});
        navigate('/');
    }

    return (
        <div className={styles.toolbar} >
            <h1 className={styles.title} onClick={() => { currentUser.email ? navigate('/movies') : navigate('/') }} ><span className={styles.gold}>Crowned</span> Pig</h1>
            {Object.keys(currentUser).length <= 0
                ? <div>
                    <button className={styles.button} onClick={() => navigate('/register')} >Sign Up</button>
                    <button className={styles.button} onClick={() => navigate('/login')} >Sign In</button>
                </div>
                : <div>
                    <button className={styles.button} onClick={() => navigate('/cart')} >Cart</button>
                    <button className={styles.button} onClick={() => navigate('/settings')} >Settings</button>
                    <button className={styles.button} onClick={() => logout()} >Logout</button>
                </div>
            }
        </div>
    )
}

export default HeaderSection