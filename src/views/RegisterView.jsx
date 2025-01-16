import styles from './RegisterView.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import HeaderSection from "../Components/HeaderSection";

function RegisterView() {

    const navigate = useNavigate();
    const { allGenreList, setAllGenreList } = useStoreContext();
    const { accountList, setAccountList } = useStoreContext();

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

    function submitForm() {
        if (!sameEmailChecker()) {
            if (rePasswordCheck()) {
                if (chosenGenreList.length < 10) {
                    alert('Please select minimum 10 genres');
                } else {
                    setAllGenreList((prevList) => prevList.set(email, chosenGenreList));
                    setAccountList(prevList => { //Creates an object filled with info and adds it the to account list

                        return [...prevList, {
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName
                        }]
                    })
                    navigate('/login');
                }
            } else {
                alert('Passwords are not the same');
            }
        } else {
            alert('This email is already in use');
        }
    }

    function rePasswordCheck() {
        if (rePassword === password) {
            return true
        } else {
            return false
        }
    }

    function sameEmailChecker() {

        for (let i = 0; i < accountList.length; i++) {
            if (accountList[i].email == email) {
                return true
            }
        }
        return false
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
                <form className={styles.form} onSubmit={() => { event.preventDefault(); submitForm() }} >
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
                </form>
            </div>
        </div>
    )
}

export default RegisterView