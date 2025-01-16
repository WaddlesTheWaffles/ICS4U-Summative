import styles from './ErrorView.module.css';
import HeaderSection from '../Components/HeaderSection';

function ErrorView() {

    return (
        <div>
            <HeaderSection />
            
            <h1 className={styles.title}>The Page Does Not Exist</h1>
        </div>
    );
}

export default ErrorView