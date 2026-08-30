import { Link } from 'react-router-dom'
import { IconRoute, IconTent, IconPlus, IconArrowRight } from '../components/Icons.jsx'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={`page ${styles.home}`}>
      <section className={styles.hero}>
        <h1 className="brandTitle brandTitle--hero">QAREA</h1>
        <p className={`brandTitle brandTitle--claim ${styles.claim}`}>Go slow and see more.</p>
        <p className={styles.tagline}>
          Rutas y paradas pet-friendly para viajar sin prisa juntos.
        </p>
      </section>

      <nav className={styles.destinations} aria-label="Secciones">
        <Link to="/hikings" className={`${styles.destination} ${styles.hikings}`}>
          <span className={styles.mark}>
            <IconRoute width="100%" height="100%" strokeWidth={1} />
          </span>
          <h2 className={`brandTitle ${styles.destinationTitle}`}>Rutas</h2>
          <p className={styles.destinationText}>
            Recorridos con calma y en naturaleza, pensados para ir con perrete.
          </p>
          <span className={styles.cta}>
            Ver rutas
            <IconArrowRight width={18} height={18} className={styles.ctaArrow} />
          </span>
        </Link>

        <Link to="/overnights" className={`${styles.destination} ${styles.overnights}`}>
          <span className={styles.mark}>
            <IconTent width="100%" height="100%" strokeWidth={1} />
          </span>
          <h2 className={`brandTitle ${styles.destinationTitle}`}>Pernoctas</h2>
          <p className={styles.destinationText}>
            Zonas donde dormir, descansar y seguir el viaje al día siguiente.
          </p>
          <span className={styles.cta}>
            Ver pernoctas
            <IconArrowRight width={18} height={18} className={styles.ctaArrow} />
          </span>
        </Link>
      </nav>

      <Link to="/formchoice" className={styles.publish}>
        <span className={styles.publishIcon}>
          <IconPlus width={20} height={20} />
        </span>
        <span>
          <span className={styles.publishTitle}>Publicar un lugar</span>
          <span className={styles.publishText}>Comparte una ruta o una pernocta que conozcas.</span>
        </span>
      </Link>
    </div>
  )
}

export default Home
