import styles from './CartView.module.css';
import HeaderSection from "../Components/HeaderSection";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { Map } from 'immutable';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function CartView() {

    const navigate = useNavigate();
    const auth = getAuth();

    const { cart, setCart, perviousPurchaseHistory, setPreviousPurchaseHistory } = useStoreContext();

    async function checkout() {

        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(docRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const existingPurchaseHistory = Map(userData.previousPurchaseHistory || {});
                    const updatedPurchaseHistory = existingPurchaseHistory.merge(cart);

                    await updateDoc(docRef, {
                        previousPurchaseHistory: updatedPurchaseHistory.toJS()
                    });

                    setPreviousPurchaseHistory(updatedPurchaseHistory);
                    localStorage.setItem('previousPurchaseHistory', JSON.stringify(updatedPurchaseHistory));
                    setCart(Map());
                    alert('Thank you for your purchase!');
                    navigate('/movies');
                } else {
                    console.error("User document does not exist");
                }
            } else {
                console.error("No current user");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart.toJS()));
    }, [cart]);

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
            <button className={styles.checkoutButton} type="button" onClick={(event) => { event.preventDefault(); checkout() }}>Checkout</button>
        </div>
    );
}

export default CartView;
