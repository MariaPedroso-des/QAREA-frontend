import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import { getOvernightById, deleteOvernight } from '../services/overnightsService.js'

const OvernightDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const urlAPI = import.meta.env.VITE_APP_API_URL
  
  const [overnight, setOvernight] = useState(null)
  const [loading, setLoading] =useState(true)
  const [error, setError] = useState(null)
  

  useEffect(() => {
    const fetchOvernightById = async () => {
      try {
        setError(null)

        const data = await getOvernightById(urlAPI,id)
        setOvernight(data)
      } catch (error) {
        console.log(error)
        setError('Error al cargar el detalle de esta zona')
      } finally {
        setLoading(false)
      }
    }
    fetchOvernightById()
  }, [id, urlAPI])

  const handleDelete = async  () => {
    const confirmDlt = window.confirm('¿Seguro que quieres eliminar esta zona de pernocta?')

    if(!confirmDlt) return

    try {
      setError(null)

      await deleteOvernight(urlAPI, id)

      alert('Zona de pernocta eliminada correctamente')
      navigate('/overnights')
    } catch(error) {
      console.log(error)
      setError(error.message || 'Error al eliminar la zona de pernocta')
    }
  }

  if (loading) return <Loader />
  if (error) return <p>{error}</p>
  if (!overnight) return <p>No se ha encontrado esta zona de pernocta. Comprueba que sigue estando disponible</p>
  
  return (
    <>
      <main className="pageContainer">
        <section className="section">
          <Link to="/overnights">← Volver a pernoctas</Link>
        </section>

        <div className="card">
          <section className="sectionCard">
          {/*SOLO RENDERIZA  SI VIENE IMG*/}
          {overnight.image && <img src={overnight.image} alt={overnight.name} />}
          <h1>{overnight.name}</h1>
          </section>
        </div>

        <section className="sectionCard">
          <p><strong>Provincia: </strong> {overnight.province}</p>
          <p><strong>Servicios: </strong> {Array.isArray(overnight.services) ? overnight.services.join(', ') : overnight.services}</p>
          <p><strong>Capacidad: </strong> {overnight.capacity}</p>
          <p><strong>Proximidad: </strong> {Array.isArray(overnight.proximity) ? overnight.proximity.join(', ') : overnight.proximity}</p>
          <p><strong>Ubicación:</strong>
            {overnight.mapsLink ? (
              <a href={overnight.mapsLink} target="_blank" rel="noreferrer"> Ver</a>
            ) : (
              ' No disponible'
            )}
          </p>
          <p><strong>Descripción: </strong> {overnight.description}</p>
          <p><strong>Estancia: </strong> {overnight.stay}</p>
          <p><strong>Limitaciones: </strong> {Array.isArray(overnight.limitations) ? overnight.limitations.join(', ') : overnight.limitations}</p>
        </section>

        <section className="section">
          <Link to={`/overnights/edit/${overnight._id}`}>
            <button type="button">Editar</button>
          </Link>
          <button type="button" onClick={handleDelete}>Eliminar</button>
        </section>
      </main>
    </>
  )
}

export default OvernightDetailPage