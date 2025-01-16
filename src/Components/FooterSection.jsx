import styles from './FooterSection.module.css';

function FooterSection() {

    return (
        <div className={styles.footerSec}>
            <div className={styles.infoBox}>
                <h1 className={styles.title}>Github</h1>
                <a className={styles.textLink} href="https://github.com/WaddlesTheWaffles">My Github</a>
                <a className={styles.textLink} href="https://github.com/WaddlesTheWaffles/ICS4U-Assignment-6">Website repository</a>
            </div>
            <div className={styles.infoBox}>
                <h1 className={styles.title} >Contact Info</h1>
                <p className={styles.text}>Name: Jayden <br /> Phone Number: 647-XXXX-XXXX</p>
            </div>
        </div>
    )
}

export default FooterSection