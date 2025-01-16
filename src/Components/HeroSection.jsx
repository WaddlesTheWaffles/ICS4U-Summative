import styles from './HeroSection.module.css';
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className={styles.heroSection} >
            <h1 className={styles.title}>Start Renting Movies Now</h1>
            <button className={styles.signUpButton} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
    )
}

export default HeroSection