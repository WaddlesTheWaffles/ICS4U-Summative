import { useState, useEffect } from 'react'
import { useStoreContext } from '../Context/index.jsx'
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from "../firebase";
import HeaderSection from '../Components/HeaderSection.jsx'
import FooterSection from '../Components/FooterSection.jsx'
import GenresList from "../Components/Genres"
import GenreView from './GenreView.jsx'
import DetailView from './DetailView.jsx'
import styles from './MoviesView.module.css'

function MoviesView() {
   const auth = getAuth();
   const { userGenreList, setUserGenreList } = useStoreContext();
   const { currentUser, setCurrentUser } = useStoreContext();
   const genreList = userGenreList;
   const [genreSelected, setGenreSelected] = useState(genreList[0].id); // Uses the first genre in the list as a default
   const [movieIdClicked, setMovieIdClicked] = useState(912649); // Uses Venom last dance as default movie
   const [detailViewDisplayed, setDetailViewDisplayed] = useState(false);
   const [clickedFromFeature, setClickedFromFeature] = useState(false);
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [loadingName, setLoadingName] = useState(true);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
              setCurrentUser(user);
              const docRef = doc(firestore, 'users', user.uid);
              const docSnapshot = await getDoc(docRef);

              if (docSnapshot.exists()) {
                  const data = docSnapshot.data();
                  if (data.signInMethod === 'google') {
                      const userData = JSON.parse(localStorage.getItem('user'));
                      setFirstName(userData.displayName.split(' ')[0]);
                      setLastName(userData.displayName.split(' ')[1]);
                  } else {
                      setFirstName(data.firstName);
                      setLastName(data.lastName);
                  }
              } else {
                  console.error("Document does not exist");
              }
          } else {
              console.error("No current user");
          }
          setLoadingName(false);
      });

      return () => unsubscribe();
  }, [auth, setCurrentUser]);
   function setGenreId(genre) {
      setGenreSelected(genre);
      setdetailViewDisplayed(false)
   }

   function setMovieIdValue(movie) {
      setMovieIdClicked(movie)
      setClickedFromFeature(false)
      setdetailViewDisplayed(true)
   }

   function returnToGenreView() {
      setdetailViewDisplayed(false)
   }

   if (loadingName) {
      return <div>Loading...</div>;
   }

   return (
      <div>
         <HeaderSection />
         <div>
            <h1 className={styles.welcomeTitle} >Welcome {firstName} {lastName}</h1>
         </div>
         <div className={styles.genreSection}>
            <div className={styles.genreList} >
               <GenresList selectGenreId={setGenreId} genresList={genreList} genreSelected={genreSelected} />
            </div>
            <div className={styles.genreView} >
               {detailViewDisplayed ?
                  <DetailView movieId={movieIdClicked} backToGenre={returnToGenreView} clickedFromFeature={clickedFromFeature} />
                  : <GenreView genreId={genreSelected} enterDetailView={setMovieIdValue} />}
            </div>
         </div>
         <FooterSection />
      </div>
   )
}

export default MoviesView