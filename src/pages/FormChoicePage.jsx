import { Link } from 'react-router-dom'
import styles from './FormChoicePage.module.css'

const FormChoicePage = () => {
  return(
    <>
      <main className={styles.choicePage}>
        <section className="section">
          <Link to="/">← Volver</Link>
        </section>
        
        <section className={styles.choiceHero}>
          <h1>¿Qué quieres publicar?</h1>
          <h3 className={styles.choiceIntro}>
            Elige si quieres añadir una ruta o una zona de pernocta
          </h3>
        </section>
      <section className={styles.choiceGrid}>
          <Link to="/hikings/new" className={`${styles.choiceCard} ${styles.choiceRoutes}`}>
            <span className={styles.choiceEyebrow}>Subir ruta</span>
            <h2 className={styles.choiceTitle}>Rutas</h2>
            <p className={styles.choiceText}>
              Comparte una ruta de senderismo para hacer con perrete
            </p>
          </Link>
          <Link to="/overnights/new" className={`${styles.choiceCard} ${styles.choiceOvernights}`}>
            <span className={styles.choiceEyebrow}>Subir pernocta</span>
            <h2 className={styles.choiceTitle}>Pernoctas</h2>
            <p className={styles.choiceText}>
              Comparte una zona donde descansar con tu camper y tu perrete
            </p>
          </Link>
        </section>
      </main>
    </>
  )
}

export default FormChoicePage