//navabar porque va a ser común a todas las páginas
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.navBrand}>QAREA</Link>

        <nav className={styles.navLinks}>
          <Link to="/hikings" className={`${styles.navLink} ${styles.navRoutes}`}>Rutas</Link>
          <Link to="/overnights" className={`${styles.navLink} ${styles.navOvernights}`}>Pernoctas</Link>
          <Link 
            to="/formchoice" className={`${styles.navLink} ${styles.navPublish}`}>Publicar</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar