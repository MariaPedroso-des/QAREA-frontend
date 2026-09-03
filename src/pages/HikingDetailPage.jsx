import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import { getHikingById, deleteHiking } from '../services/hikingsService.js'

const HikingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const urlAPI = import.meta.env.VITE_APP_API_URL
  
  const [hiking, setHiking] = useState(null)
  const [loading, setLoading] =useState(true)
  const [error, setError] = useState(null)
  

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

  const handleDelete = async  () => {
    const confirmDlt = window.confirm('¿Seguro que quieres eliminar esta ruta?')

    if(!confirmDlt) return

    try {
      setError(null)

      await deleteHiking(urlAPI, id)

      alert('Ruta eliminada correctamente')
      navigate('/hikings')
    } catch(error) {
      console.log(error)
      setError(error.message || 'Error al eliminar la ruta')
    }
  }

  if (loading) return <Loader />
  if (error) return <p>{error}</p>
  if (!hiking) return <p>No se ha encontrado esta ruta. Comprueba que sigue estando disponible</p>
  
  return (
    <>

      <main className="pageContainer">
        <section className="section">
          <Link to="/hikings">← Volver a rutas</Link>
        </section>

        <div className="card">
          <section className="sectionCard">
            {/*SOLO RENDERIZA  SI VIENE IMG*/}
            {hiking.image && <img src={hiking.image} alt={hiking.name} />}
            <h1>{hiking.name}</h1>
          </section>
        </div>

        <section className="sectionCard">
          <p><strong>Distancia en kilómetros:</strong> {hiking.distanceKm}</p>
          <p><strong>Provincia:</strong> {hiking.province}</p>
          <p><strong>Dificultad:</strong> {hiking.difficulty}</p>
          <p><strong>Homologación:</strong> {hiking.approvedFEDME}</p>
          <p><strong>Ubicación del inicio de la ruta:</strong>
            {hiking.mapsLink ? (
              <a href={hiking.mapsLink} target="_blank" rel="noreferrer"> Ver</a>
            ) : (
              ' No disponible'
            )}
          </p>
          <p><strong>Descripción:</strong> {hiking.description}</p>
          <p><strong>Descripción del terreno:</strong> {Array.isArray(hiking.typeTerrain) ? hiking.typeTerrain.join(', ') : hiking.typeTerrain}</p>
          <p><strong>Acceso a agua durante la ruta:</strong> {Array.isArray(hiking.accessWater) ? hiking.accessWater.join(', ') : hiking.accessWater}</p>
        </section>

        <section className="section">
          <Link to={`/hikings/edit/${hiking._id}`}>
            <button type="button">Editar</button>
          </Link>
          <button type="button" onClick={handleDelete}>Eliminar</button>
        </section>
      </main>
    </>
  )
}

export default HikingDetailPage