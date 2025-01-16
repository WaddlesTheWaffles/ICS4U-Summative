import styles from './CartView.module.css';
import HeaderSection from "../Components/HeaderSection";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom";

function CartView() {

    const navigate = useNavigate();

    const { cart, setCart } = useStoreContext();

    return (
        <div>
            <HeaderSection />
            <h1 className={styles.cartTitle}>Cart</h1>
            <button className={styles.cartBackButton} type="button" onClick={() => navigate('/movies')}>Back</button>
            <div className={styles.cart}>
                {cart.entrySeq().map(([movieId, movieInfo]) => {
                    return (
                        <div key={movieId} className={styles.movieTile}>
                            <img className={styles.movieImage}
                                src={movieInfo.moviePoster ? (
                                    `https://image.tmdb.org/t/p/w400${movieInfo.moviePoster}`
                                ) : (
                                    `https://placehold.co/400x600?text=Movie+Poster+Unavailable+for+${movieInfo.movieTitle}`)}
                                alt={movieInfo.movieTitle}
                            />
                            <h1 className={styles.cartMovieTitle} >{movieInfo.movieTitle}</h1>
                            <button className={styles.removeButton} type="button" onClick={() => { setCart(cart.delete(movieId)); }}> Remove </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CartView;
