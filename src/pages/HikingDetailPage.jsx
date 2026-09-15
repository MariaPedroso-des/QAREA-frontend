import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink.jsx'
import Loader from '../components/Loader.jsx'
import { getHikingById, deleteHiking } from '../services/hikingsService.js'

import styles from './DetailPage.module.css'

const toText = (value) => (Array.isArray(value) ? value.join(', ') : value)

const HikingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const urlAPI = import.meta.env.VITE_APP_API_URL
  
  const [hiking, setHiking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchHikingById = async () => {
      try {
        setError(null)

        const data = await getHikingById(urlAPI, id)
        setHiking(data)
      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar el detalle de esta ruta')
      } finally {
        setLoading(false)
      }
    }
    fetchHikingById()
  }, [id, urlAPI])

  const handleDelete = async () => {
    try {
      setError(null)
      setDeleting(true)
      await deleteHiking(urlAPI, id)
      navigate('/hikings')
    } catch (error) {
      console.log(error)
      setError(error.message || 'Error al eliminar la ruta')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return <Loader label="Cargando ruta" />

  if (error && !hiking) {
    return (
      <div className="page page--narrow">
        <BackLink to="/hikings">Rutas</BackLink>
        <p className="errorMessage">{error}</p>
      </div>
    )
  }

  if (!hiking) {
    return (
      <div className="page page--narrow">
        <BackLink to="/hikings">Rutas</BackLink>
        <h1>Ruta no disponible</h1>
        <p>No hemos encontrado esta ruta. Puede que se haya eliminado.</p>
      </div>
    )
  }

  return (
    <div className="page page--narrow">
      <BackLink to="/hikings">Rutas</BackLink>

      <header className={styles.hero}>
        {hiking.image && (
          <img className={styles.heroImage} src={hiking.image} alt={hiking.name} />
        )}
        <h1 className={styles.title}>{hiking.name}</h1>
        <p className={styles.meta}>
          <span className={styles.tag}>{hiking.province}</span>
          <span className={styles.tag}>{hiking.distanceKm} km</span>
          {hiking.difficulty && <span className={styles.tag}>{hiking.difficulty}</span>}
        </p>
      </header>

      <p className={styles.description}>{hiking.description}</p>

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Homologación FEDME</dt>
          <dd className={styles.rowValue}>{hiking.approvedFEDME}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>Terreno</dt>
          <dd className={styles.rowValue}>{toText(hiking.typeTerrain)}</dd>
        </div>
       <div className={styles.row}>
          <dt className={styles.rowLabel}>Acceso a agua</dt>
          <dd className={styles.rowValue}>{toText(hiking.accessWater)}</dd>
        </div>
        </dl>

        {hiking.mapsLink && (
          <p className={styles.mapLink}>
            <a
              className="btn btn--secondary"
              href={hiking.mapsLink}
              target="_blank"
              rel="noreferrer"
            >
              Ver el inicio de la ruta en el mapa
            </a>
          </p>
        )}

        {error && <p className="errorMessage">{error}</p>}

      <div className={styles.actions}>
        {confirmDelete ? (
          <div className={styles.confirm}>
            <p className={styles.confirmText}>¿Eliminar esta ruta? No se puede deshacer.</p>
            
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
            <Link to={`/hikings/edit/${hiking._id}`} className="btn btn--secondary">
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

export default HikingDetailPage