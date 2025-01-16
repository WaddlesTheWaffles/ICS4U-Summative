import styles from './GenreView.module.css';
import { useState, useEffect } from "react";
import { useStoreContext } from '../Context';
import axios from "axios";

function GenreView({ genreId, enterDetailView }) {
    const { cart, setCart } = useStoreContext();
    const [fetchingMovies, setFetchingMovies] = useState(true);
    const [movies, setMovies] = useState([]);
    const [maxPages, setMaxPages] = useState(1)
    let [page, setPage] = useState(1);

    useEffect(() => { //Sets the page number to 1 everytime the genre is changed
        (async function setPageToOne() {
            setPage(1);
        })();
    }, [genreId])

    useEffect(() => { //calls api for the list of movies
        (async function getMovies() {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
                );
                setMovies(response.data.results);
                setFetchingMovies(false);
                setMaxPages(response.data.total_pages);
            } catch (error) {
                console.error("ERROR in fetching movies", error);
                setFetchingMovies(false);
            }
        })();
    }, [genreId, page]);

    function renderMoviePosters() {
        if (movies.length <= 19) {
            return null

        } else {
            return (
                <div>
                    <div className={styles.moviesContainer}>
                        {movies.map((movie) => (
                            <div key={movie.id} className={styles.moviePoster}>
                                <div className={styles.posterContainer} onClick={() => enterDetailView(movie.id)}>
                                    <img
                                        src={movie.poster_path ?
                                            `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                                            : `https://placehold.co/300x450?text=Movie+Poster+Unavailable`}
                                        alt={movie.title}
                                    />
                                </div>
                                <h1 className={styles.movieTitle}>{movie.title}</h1>
                                {cart.has(movie.id) ? (
                                <button disabled className={styles.buyButton} type="button">Added</button>
                                ) : (
                                <button className={styles.buyButton} type="button" onClick={(event) => {
                                    event.preventDefault();
                                    setCart(cart.set(movie.id, { movieTitle: movie.title, moviePoster: movie.poster_path }));
                                }}>Buy</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.pageSelector}>
                        <button className={styles.prevButton} onClick={() => page > 1 ? setPage(page - 1) : alert('You are on the first page, there is no previous page.')} >Previous</button>
                        <input className={styles.pageNumberBox} type="number" min={1} max={maxPages} value={page} onChange={(event) => { Number(event.target.value) >= 1 && Number(event.target.value) <= maxPages ? setPage(Number(event.target.value)) : alert('Page Does not exist') }} />
                        <button className={styles.nextButton} onClick={() => page < maxPages ? setPage(page + 1) : alert('You are on the last page, there is no last page')}>Next</button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            {fetchingMovies ? <p>Loading</p> : renderMoviePosters()}
        </div>
    )
}

export default GenreView