import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <>
      <main className={styles.homePage}>
        <section className={styles.heroHome}>
          <h1 className={`brandTitle brandTitle--hero ${styles.brandHome}`}>QAREA</h1>
          <h3 className={styles.tagLine}>rutas y paradas pet-friendly para viajar juntos</h3>
        </section>
        <section className={styles.ctaGrid}>
          <Link to="/hikings" className={`${styles.ctaCard} ${styles.ctaRoutes}`}>
            <span className={styles.ctaEyebrow}>Explorar</span>
            <h2 className={styles.ctaTitle}>Rutas</h2>
            <p className={styles.ctaText}>
              Encuentra recorridos para moverte con calma y en la naturaleza, pensadas para ir con perrete
            </p>
          </Link>
          <Link to="/overnights" className={`${styles.ctaCard} ${styles.ctaOvernights}`}>
            <span className={styles.ctaEyebrow}>Buscar</span>
            <h2 className={styles.ctaTitle}>Pernoctas</h2>
            <p className={styles.ctaText}>
              Descubre paradas y áreas útiles para dormir, descansar y seguir viajando juntos              
            </p>
          </Link>
          <Link to="/formchoice" className={`${styles.ctaCard} ${styles.ctaPublish}`}>
            <span className={styles.ctaEyebrow}>Publicar</span>
            <h2 className={styles.ctaTitle}>Nueva entrada</h2>
            <p className={styles.ctaText}>
              Añade una ruta o zona de pernocta y haz que crezca esta comunidad
            </p>
          </Link>
        </section>
      </main>
    </>
  )
}

export default Home