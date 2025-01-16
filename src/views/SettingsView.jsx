import styles from './SettingsView.module.css'
import HeaderSection from "../Components/HeaderSection";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";

function SettingsView() {

    const navigate = useNavigate();
    const { allGenreList, setAllGenreList } = useStoreContext();
    const { accountList, setAccountList } = useStoreContext();
    const { currentAccount, setCurrentAccount } = useStoreContext();

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
    const [firstName, setFirstName] = useState(currentAccount.firstName);
    const [lastName, setLastName] = useState(currentAccount.lastName);
    const [email, setEmail] = useState(currentAccount.email);

    const [chosenGenreList, setChosenGenreList] = useState(allGenreList.get(currentAccount.email) || []);

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

    function applyChanges() {

        if (chosenGenreList.length < 10) {
            alert('Please choose minimum 10 genres')
        } else {
            let accountIndex = accountList.findIndex(account => account.email === currentAccount.email);
            currentAccount.firstName = firstName;
            currentAccount.lastName = lastName;
            accountList[accountIndex] = currentAccount;
            setAllGenreList(allGenreList.set(email, chosenGenreList))
            alert("Settings have been saved.");
        }
    }

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