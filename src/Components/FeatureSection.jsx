import styles from './FeatureSection.module.css';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

function FeatureSection() {
    const [movies, setMovies] = useState([]);
    const [movie1, setMovie1] = useState(0);
    const [movie2, setMovie2] = useState(1);
    const [movie3, setMovie3] = useState(2);
    const [movie4, setMovie4] = useState(3);
    const [fetchingMovies, setFetchingMovies] = useState(true); //true means it's still fetching the movies from the api
    const navigate = useNavigate();

    useEffect(() => { //Selects 3 random different movies
        (function randMovies() {
            let m1 = Math.floor(Math.random() * 20) + 1;
            let m2, m3, m4;

            do {
                m2 = Math.floor(Math.random() * 20) + 1;
            } while (m2 == m1);

            do {
                m3 = Math.floor(Math.random() * 20) + 1;
            } while (m3 == m1 || m3 == m2);

            do {
                m4 = Math.floor(Math.random() * 20) + 1;
            } while (m4 == m1 || m4 == m2 || m4 == m3);

            setMovie1(m1);
            setMovie2(m2);
            setMovie3(m3);
            setMovie4(m4);
        })()
    }, []);

    useEffect(() => { //calls the api to get the 20 movies in the page
        (async function getMovies() {
            try {
                const responsePages = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?include_adult=false&with_original_language=en&language=en-US&api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
                const page = Math.floor(Math.random() * responsePages.data.total_pages / 4) + 1;

                const responseMovies = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?include_adult=false&with_original_language=en&language=en-US&page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
                setMovies(responseMovies.data.results);
                setFetchingMovies(false);
            } catch (error) {
                console.error("ERROR in fetching movies", error);
                setFetchingMovies(false);
            }
        })();
    }, [])

    function renderMoviePosters(movieSlot) {
        const movie = movies[movieSlot];
        if (!movie) { //checks if movie is null or undefined
            return null;

        }

        postersRendered++;
        return (
            <div key={movie.id} className={styles.moviePoster}>
                <div className={styles.posterContainer} onClick={() => navigate(`/movies/${movie.id}`)}>
                    <img
                        src={movie.poster_path ?
                            `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                            : `https://placehold.co/400x600?text=Movie+Poster+Unavailable+for+${movie.title}`}
                        alt={movie.title}
                    />
                </div>
                <h1 className={styles.title}>{movie.title}</h1>
            </div>
        )
    }

    let postersRendered = 0;
    return (
        <div className={styles.featureSection}>
            <h1 className={styles.sectionTitle}>Currently Playing</h1>
            <div className={styles.movieContainer}>
                {fetchingMovies ? <p>Loading...</p> : ( //multiple checks for if the movies array is filled, BUG: only 2 posters will load reason unknown
                    <>
                        {movies.length > 19 && renderMoviePosters(movie1)}
                        {movies.length > 19 && renderMoviePosters(movie2)}
                        {movies.length > 19 && renderMoviePosters(movie3)}
                        {postersRendered == 2 && renderMoviePosters(movie4)}
                    </>
                )}
            </div>
        </div>
    )
}

export default FeatureSection