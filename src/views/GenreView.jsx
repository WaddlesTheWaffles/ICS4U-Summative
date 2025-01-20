import styles from './GenreView.module.css';
import { useState, useEffect } from "react";
import { useStoreContext } from '../Context';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { auth } from '../firebase';
import { Map } from 'immutable';
import axios from "axios";

function GenreView({ genreId, setMovieId }) {
    const { cart, setCart, previousPurchaseHistory, setPreviousPurchaseHistory } = useStoreContext();
    const [fetchingMovies, setFetchingMovies] = useState(true);
    const [movies, setMovies] = useState([]);
    const [maxPages, setMaxPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        setPage(1);
    }, [genreId]);

    useEffect(() => {
        const fetchPreviousPurchaseHistory = async () => {
            try {
                const history = JSON.parse(localStorage.getItem("previousPurchaseHistory")) || {}; // Default to empty object
                const purchaseHistoryMap = Map(history); // Convert to Immutable Map
                setPreviousPurchaseHistory(purchaseHistoryMap);
                setLoadingHistory(false);
            } catch (error) {
                console.error("Error loading purchase history:", error);
            }
        };

        fetchPreviousPurchaseHistory();
    }, [setPreviousPurchaseHistory]);

    useEffect(() => {
        const fetchMovies = async () => {
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
        };

        fetchMovies();
    }, [genreId, page]);

    function enterDetailView(movieId) {
        setMovieId(movieId);
    }

    if (fetchingMovies) {
        return <div>Loading...</div>;
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
                            ) : previousPurchaseHistory.has(String(movie.id)) ? (
                                <button disabled className={styles.buyButton} type="button">Purchased</button>
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
                    <button className={styles.prevButton} onClick={() => page > 1 ? setPage(page - 1) : alert('You are on the first page, there is no previous page.')}>Previous</button>
                    <input className={styles.pageNumberBox} type="number" min={1} max={maxPages} value={page} onChange={(event) => { Number(event.target.value) >= 1 && Number(event.target.value) <= maxPages ? setPage(Number(event.target.value)) : alert('Page Does not exist') }} />
                    <button className={styles.nextButton} onClick={() => page < maxPages ? setPage(page + 1) : alert('You are on the last page, there is no last page')}>Next</button>
                </div>
            </div>
        );

    }
}

export default GenreView;