import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink.jsx'
import Loader from '../components/Loader.jsx'
import { getOvernightById, deleteOvernight } from '../services/overnightsService.js'

import styles from './DetailPage.module.css'

const toText = (value) => (Array.isArray(value) ? value.join(', ') : value)

const OvernightDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const urlAPI = import.meta.env.VITE_APP_API_URL
  
  const [overnight, setOvernight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchOvernightById = async () => {
      try {
        setError(null)
        const data = await getOvernightById(urlAPI, id)
        setOvernight(data)
      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar el detalle de esta zona')
      } finally {
        setLoading(false)
      }
    }
    fetchOvernightById()
  }, [id, urlAPI])

  const handleDelete = async () => {
    try {
      setError(null)
      setDeleting(true)
      await deleteOvernight(urlAPI, id)
      navigate('/overnights')
    } catch (error) {
      console.log(error)
      setError(error.message || 'Error al eliminar la zona de pernocta')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return <Loader label="Cargando pernocta" />

  if (error && !overnight) {
    return (
      <div className="page page--narrow">
        <BackLink to="/overnights">Pernoctas</BackLink>
        <p className="errorMessage">{error}</p>
      </div>
    )
  }

  if (!overnight) {
    return (
      <div className="page page--narrow">
        <BackLink to="/overnights">Pernoctas</BackLink>
        <h1>Pernocta no disponible</h1>
        <p>No hemos encontrado esta zona. Puede que se haya eliminado.</p>
      </div>
    )
  }

  return (
    <div className="page page--narrow">
      <BackLink to="/overnights">Pernoctas</BackLink>

      <header className={styles.hero}>
        {overnight.image && (
          <img className={styles.heroImage} src={overnight.image} alt={overnight.name} />
        )}
        <h1 className={styles.title}>{overnight.name}</h1>
        <p className={styles.meta}>
          <span className={styles.tag}>{overnight.province}</span>
          <span className={styles.tag}>
            {overnight.capacity} {overnight.capacity === 1 ? 'plaza' : 'plazas'}
          </span>
          {overnight.signal && <span className={styles.tag}>Señal: {overnight.signal}</span>}
        </p>
      </header>

      <p className={styles.description}>{overnight.description}</p>

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Servicios</dt>
          <dd className={styles.rowValue}>{toText(overnight.services)}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Cerca de</dt>
          <dd className={styles.rowValue}>{toText(overnight.proximity)}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>Estancia</dt>
          <dd className={styles.rowValue}>{overnight.stay}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.rowLabel}>Limitaciones</dt>
          <dd className={styles.rowValue}>{toText(overnight.limitations)}</dd>
        </div>
      </dl>

      {overnight.mapsLink && (
        <p className={styles.mapLink}>
          <a 
            className="btn btn--secondary" 
            href={overnight.mapsLink} 
            target="_blank" 
            rel="noreferrer">
            Ver la ubicación en el mapa
          </a>
        </p>
      )}

      {error && (
        <p className="errorMessage">{error}</p>
      )}

      <div className={styles.actions}>
        {confirmDelete ? (
          <div className={styles.confirm}>
            <p className={styles.confirmText}>¿Eliminar esta pernocta? No se puede deshacer.</p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                autoFocus
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to={`/overnights/edit/${overnight._id}`} className="btn btn--secondary">
              Editar
            </Link>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default OvernightDetailPage