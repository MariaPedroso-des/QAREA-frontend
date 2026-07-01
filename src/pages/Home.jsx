import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <>
      <main className={styles.homePage}>
        <section className={styles.heroHome}>
          <h1 className={`brandTitle brandTitle--hero ${styles.brandHome}`}>QAREA</h1>
          <p className={`brandTitle brandTitle--claim ${styles.claimHome}`}>Go slow and see more.</p>
          <h3 className={styles.tagLine}>Rutas y paradas pet-friendly para viajar sin prisa juntos</h3>
        </section>
        <section className={styles.ctaGrid}>
          <Link to="/hikings" className={`${styles.ctaCard} ${styles.ctaRoutes}`}>
            <span className={styles.ctaEyebrow}>Explorar</span>
            <h2 className={styles.ctaTitle}>Rutas pet-friendly</h2>
            <p className={styles.ctaText}>
              Recorridos para moverte con calma y en la naturaleza, pensados para ir con perrete
            </p>
          </Link>
          <Link to="/overnights" className={`${styles.ctaCard} ${styles.ctaOvernights}`}>
            <span className={styles.ctaEyebrow}>Buscar</span>
            <h2 className={styles.ctaTitle}>Pernoctas y paradas</h2>
            <p className={styles.ctaText}>
              Zonas útiles para dormir, descansar y continuar el viaje             
            </p>
          </Link>
          <Link to="/formchoice" className={`${styles.ctaCard} ${styles.ctaPublish}`}>
            <span className={styles.ctaEyebrow}>Comunidad</span>
            <h2 className={styles.ctaTitle}>Un nuevo lugar</h2>
            <p className={styles.ctaText}>
              Comparte rutas y paradas para ayudar a otros viajeros
            </p>
          </Link>
        </section>
      </main>
    </>
  )
}

export default Home