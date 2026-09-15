import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
/*import { IconRoute } from '../components/Icons.jsx'*/
import { getAllHikings } from '../services/hikingsService.js'
import { getHikingOptions } from '../services/hikingOptionsService.js'

import styles from './ListPage.module.css'

const emptyFilters = {
  province: '',
  difficulty: '',
  distanceKm: 1,
  typeTerrain: '',
  approvedFEDME: '',
  accessWater: '',
}

const HikingsPage = () => {
  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [hikings, setHikings] = useState([])

  const [filtersOptions, setFiltersOptions] = useState({
    province: [],
    difficulty: [],
    typeTerrain: [],
    approvedFEDME: [],
    accessWater: [],
  })

  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const maxDistance = hikings.length > 0 ? Math.max(...hikings.map((e) => e.distanceKm || 1)) : 1

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [hikingsArray, optionsData] = await Promise.all([
          getAllHikings(urlAPI),
          getHikingOptions(urlAPI),
        ])

        setHikings(hikingsArray)
        setFiltersOptions(optionsData)

        const distance = hikingsArray.length > 0
          ? Math.max(...hikingsArray.map((e) => e.distanceKm || 1))
          : 1

        setFilters({ ...emptyFilters, distanceKm: distance })
      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [urlAPI])

  const handleFiltersChange = (e) => {
    const { name, value } = e.target
    setFilters((preFilter) => ({ ...preFilter, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({ ...emptyFilters, distanceKm: maxDistance })
  }

  const filtersConfig = [
    {
      name: 'province',
      label: 'Provincia',
      type: 'select',
      options: filtersOptions.province,
      defaultOption: 'Dónde quieres ir',
    },
    {
      name: 'difficulty',
      label: 'Dificultad',
      type: 'select',
      options: filtersOptions.difficulty,
      defaultOption: 'Qué dificultad buscas',
    },
    {
      name: 'typeTerrain',
      label: 'Tipo de terreno',
      type: 'select',
      options: filtersOptions.typeTerrain,
      defaultOption: 'Qué tipo de terreno es',
    },
    {
      name: 'approvedFEDME',
      label: 'Homologación FEDME',
      type: 'select',
      options: filtersOptions.approvedFEDME,
      defaultOption: 'Tipo de homologación'
    },
    {
      name: 'accessWater',
      label: 'Acceso a agua',
      type: 'select',
      options: filtersOptions.accessWater,
      defaultOption: 'Si buscas agua cerca',
    },
    {
      name: 'distanceKm',
      label: 'Distancia máxima',
      type: 'range',
      min: 1,
      max: maxDistance,
      unit: 'km',
    },
  ]

  const filteredHikings = hikings.filter((e) => {
    const chosenProvince = 
      filters.province === '' || e.province === filters.province
    
    const chosenDifficulty = 
      filters.difficulty === '' || e.difficulty === filters.difficulty
  
    const chosenDistance = 
      e.distanceKm <= Number(filters.distanceKm)
  
    const chosenTerrain = 
      filters.typeTerrain === '' || 
      (Array.isArray(e.typeTerrain) 
      ? e.typeTerrain.includes(filters.typeTerrain) 
      : e.typeTerrain === filters.typeTerrain)
  
    const chosenApproved = 
      filters.approvedFEDME === '' || e.approvedFEDME === filters.approvedFEDME
  
    const chosenWater = 
      filters.accessWater === '' || 
      (Array.isArray(e.accessWater) 
      ? e.accessWater.includes(filters.accessWater)
      : e.accessWater === filters.accessWater)

    return (
      chosenProvince &&
      chosenDifficulty &&
      chosenDistance &&
      chosenTerrain &&
      chosenApproved &&
      chosenWater
    )
  })

  if (loading) return <Loader label="Cargando rutas" />

  if (error) {
    return (
      <div className="page">
        <header className="pageHeader">
          <h1>Rutas</h1>
        </header>
        <div className={styles.errorBox}>
          <p className="errorMessage">{error}</p>
          <button type="button" className="btn btn--secondary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="page">
      <section className="section">
        <h1 className={styles.pageTitle}>Rutas para moverse juntos</h1>
        
        <FiltersPanel 
          filters={filters}
          handleFiltersChange={handleFiltersChange}
          filtersConfig={filtersConfig}
          resetFilters={resetFilters}
          resultsCount={filteredHikings.length}
        />
      </section>

      <section className={styles.cardsGrid}>
        {filteredHikings.length === 0 ? (
          <p className={styles.emptyState}>Aún no existen rutas que coincidan con tu búsqueda</p>
        ) : (
          filteredHikings.map((e) => (
            <article key={e._id} className={styles.itemCard}>
              <Link to={`/hikings/${e._id}`} className={styles.cardLink}>
                <div className={styles.cardThumb}>
                  {e.image ? (<img src={e.image} alt={e.name} />) : null}
                </div>
                <div>
                  <h2 className={styles.cardName}>{e.name}</h2>
                  <p className={styles.cardInfo}>{e.province}</p>
                  <p className={styles.cardInfo}>{e.distanceKm} km</p>
                </div>
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

export default HikingsPage