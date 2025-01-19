import { useState } from 'react'
import { useStoreContext } from '../Context/index.jsx'
import { getAuth } from 'firebase/auth';
import { auth } from "../firebase";
import HeaderSection from '../Components/HeaderSection.jsx'
import FooterSection from '../Components/FooterSection.jsx'
import GenresList from "../Components/Genres"
import GenreView from './GenreView.jsx'
import DetailView from './DetailView.jsx'
import styles from './MoviesView.module.css'

function MoviesView() {
   const { allGenreList, setAllGenreList } = useStoreContext();
   const { currentUser } = useStoreContext();
   // const genreList = allGenreList.get(currentUser.email); replace this with db call to get genre list
   const genreList = [ //temporary genre list
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

   const [genreSelected, setGenreSelected] = useState(genreList[0].id); //Uses the first genre in the list as a default
   const [movieIdClicked, setMovieIdClicked] = useState(912649); //Uses Venom last dance as default movie
   const [detailViewDisplayed, setdetailViewDisplayed] = useState(false);
   const [clickedFromFeature, setClickedFromFeature] = useState(false);

   try {
      const testNameSplit = (currentUser).displayName.split(' ');
  } catch (error) {
      alert('There is no display Name availble')
  }
  const nameSplit = (currentUser).displayName.split(' ');
  const [firstName, setFirstName] = useState(nameSplit[0]);
  const [lastName, setLastName] = useState(nameSplit[1]);

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