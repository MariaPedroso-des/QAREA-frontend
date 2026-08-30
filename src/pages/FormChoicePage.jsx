import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink.jsx'
import { IconRoute, IconTent } from '../components/Icons.jsx'
import styles from './FormChoicePage.module.css'

const FormChoicePage = () => {
  return (
    <div className="page page--narrow">
      <BackLink to="/">Inicio</BackLink>

      <header className="pageHeader">
        <h1>¿Qué quieres publicar?</h1>
        <p>Tarda menos de dos minutos y se hace en tres pasos.</p>
      </header>

      <div className={styles.options}>
        <Link to="/hikings/new" className={`${styles.option} ${styles.hikings}`}>
          <IconRoute width={26} height={26} />
          <span className={styles.optionTitle}>Una ruta</span>
          <span className={styles.optionText}>
            Un recorrido de senderismo para hacer con perrete.
          </span>
        </Link>

        <Link to="/overnights/new" className={`${styles.option} ${styles.overnights}`}>
          <IconTent width={26} height={26} />
          <span className={styles.optionTitle}>Una pernocta</span>
          <span className={styles.optionText}>
            Una zona donde descansar con la camper y con perrete.
          </span>
        </Link>
      </div>
    </div>
  )
}

export default FormChoicePage
