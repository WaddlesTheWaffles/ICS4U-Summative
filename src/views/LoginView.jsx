import styles from './LoginView.module.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { Map } from 'immutable';
import HeaderSection from "../Components/HeaderSection";

function LoginView() {
    const navigate = useNavigate();
    const { cart, setCart } = useStoreContext();
    const { accountList, setAccountList } = useStoreContext();
    const { currentAccount, setCurrentAccount } = useStoreContext()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateInfo() {
        if (accountList.length <= 0) { //Checks if any account has been created
            alert('There are no accounts created')

        } else if (accountList.find(account => account.email === email)) { //Checks if the email exist inside the list
            const accountIndex = accountList.findIndex(account => account.email === email)
            if ((email === accountList[accountIndex].email) && (password === accountList[accountIndex].password)) {
                setCurrentAccount(accountList[accountIndex]);
                setCart(cart.clear()) //clears the cart when ever user logins
                navigate('/movies');

            } else {
                alert('Password is incorrect');
            }
        } else {
            alert('There is no account connected to this email')
        }
    }

    return (
        <div>
            <HeaderSection />
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle} >Login</h1>
                <form className={styles.form} onSubmit={() => { event.preventDefault(); validateInfo() }}>
                    <label className={styles.boxLabels}>Email:</label>
                    <input required className={styles.infoBoxes} type="text" value={email} onChange={(event) => { setEmail(String(event.target.value)) }} />
                    <label className={styles.boxLabels}>Password:</label>
                    <input required className={styles.infoBoxes} type="password" value={password} onChange={(event) => { setPassword(String(event.target.value)) }} />

                    <input className={styles.loginButton} type="submit" value={"Login"} />
                </form>
            </div>
        </div>
    )
}

export default LoginView