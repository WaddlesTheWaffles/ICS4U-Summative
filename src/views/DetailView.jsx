import styles from './DetailView.module.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";

function DetailView({ movieId: propMovieId, backToGenre, clickedFromFeature }) {

    const navigate = useNavigate();
    const { cart, setCart } = useStoreContext();

    const params = useParams();
    const [movie, setMovie] = useState(null); // Start with null
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const movieId = propMovieId || params.movieId; //so detail view can be both in MoviesView and a seperate view
    const [featureClicked, setFeatureClicked] = useState(true);

    useEffect(() => {
        if (params.movieId == null) {
            setFeatureClicked(false)
        } else {
            setFeatureClicked(true)
        }
    }, [params.movieId])

    useEffect(() => {
        (async function getMovie() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=videos`
            );
            setMovie(response.data);
            setIsLoading(false); // Set loading state to false after data is fetched
        })();
    }, [movieId]);

    return (
        <div className={styles.movieDetails}>
            {isLoading ? (
                <div>Loading...</div> //Shows a loading message
            ) : (
                <>
                    <img className={styles.moviePoster}
                        src={movie.poster_path ?
                            `https://image.tmdb.org/t/p/w400${movie.poster_path}` :
                            `https://placehold.co/400x600?text=Movie+Poster+Unavailable+for+${movie.original_title}`}
                        alt={movie.original_title}
                    />
                    {featureClicked ? <button disabled className={styles.altBuyButton} type="button">Unavailable</button>
                        : cart.has(movie.id) ? (
                            <button disabled className={styles.buyButton} type="button">Added</button>
                        ) : (
                            <button className={styles.buyButton} type="button" onClick={(event) => {
                                event.preventDefault();
                                setCart(cart.set(movie.id, { movieTitle: movie.title, moviePoster: movie.poster_path }));
                            }}
                            >
                                Buy
                            </button>
                        )}
                    <div className={styles.movieInfo}>
                        <h1 className={styles.text} >{movie.original_title}</h1>
                        {movie.original_language == "en" ? null : <h1 className={styles.text} >Translated Title: {movie.title}</h1>}
                        <p className={styles.text} >Description:<br />{movie.overview}</p>
                        <h3 className={styles.text} >Released Date: {movie.release_date}</h3>
                        <h2 className={styles.text} >Runtime: {movie.runtime} minutes</h2>
                        <h3 className={styles.text} >Budget: {movie.budget == 0 ? "Unavailable" : "$" + (movie.budget) / 1000000 + " Million"}</h3>
                    </div>

                    <div className={styles.productionCompanies}>
                        <h1 className={styles.text}>Production Companies</h1>
                        <ul className={styles.companiesList}>
                            {movie.production_companies.map((company) => (
                                <li className={styles.text} key={company.id}>{company.name}</li>
                            ))}
                        </ul>
                    </div>

                    <h1 className={`${styles.trailerTitle} ${styles.text}`}>Teaser Trailers:</h1>
                    <div className={styles.teaserTrailers}>
                        {movie.videos && movie.videos.results.map((trailer) => (
                            trailer.type == "Teaser" || trailer.type == "Trailer" || trailer.type == "Clip" ? (
                                <div key={trailer.id} className={styles.trailerTile}>
                                    <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                                        <img className={styles.trailerThumbnail}
                                            src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                                            alt={trailer.name} />
                                        <h3 className={styles.trailerName}>{trailer.name}</h3>
                                    </a>
                                </div>
                            ) : null
                        ))}
                    </div>
                </>
            )}
            {featureClicked ?
                <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>
                : <button className={styles.backButton} onClick={() => backToGenre()}>Back</button>}
        </div>
    );
}

export default DetailView;