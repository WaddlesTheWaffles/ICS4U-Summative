import { useState } from 'react'
import { useStoreContext } from '../Context/index.jsx'
import HeaderSection from '../Components/HeaderSection.jsx'
import FooterSection from '../Components/FooterSection.jsx'
import GenresList from "../Components/Genres"
import GenreView from './GenreView.jsx'
import DetailView from './DetailView.jsx'
import styles from './MoviesView.module.css'

function MoviesView() {
   const { allGenreList, setAllGenreList } = useStoreContext();
   const { currentAccount } = useStoreContext();
   const genreList = allGenreList.get(currentAccount.email); //gets the array of genres associated with the email

   const [genreSelected, setGenreSelected] = useState(genreList[0].id); //Uses the first genre in the list as a default
   const [movieIdClicked, setMovieIdClicked] = useState(912649); //Uses Venom last dance as default movie
   const [detailViewDisplayed, setdetailViewDisplayed] = useState(false);
   const [clickedFromFeature, setClickedFromFeature] = useState(false);

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
            <h1 className={styles.welcomeTitle} >Welcome {currentAccount.firstName} {currentAccount.lastName}</h1>
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