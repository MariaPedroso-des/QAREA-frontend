import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import HikingsFilters from '../components/HikingsFilters.jsx'
import { getAllHikings } from '../services/hikingsService.js'
import { getHikingOptions } from '../services/hikingOptionsService.js'

import styles from './ListPage.module.css'

const HikingsPage = () => {
  const urlAPI = import.meta.env.VITE_APP_API_URL

  const[hikings, setHikings] = useState([])

  const [filtersOptions, setFiltersOptions] = useState({
    province: [],
    difficulty: [],
    typeTerrain: [],
    approvedFEDME: [],
    accessWater: []
  })
  
  const [filters, setFilters] = useState({
    province: '',
    difficulty: '',
    distanceKm: 1,
    typeTerrain: '',
    approvedFEDME: '',
    accessWater: ''
  })
    
  const [loading, setLoading] =useState(true)
  const [error, setError] = useState(null)
  
  const distanceKm = hikings.length > 0 ? Math.max(...hikings.map((e) => e.distanceKm || 1)) : 1
  
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

        const maxDistance = hikingsArray.length > 0 ? Math.max(...hikingsArray.map((e) => e.distanceKm || 1)) : 1
        
        setFilters({
          province: '',
          difficulty: '',
          distanceKm: maxDistance,
          typeTerrain: '',
          approvedFEDME: '',
          accessWater: ''
        })
      
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
    const { name, value } =e.target
    setFilters((preFilter) => ({
      ...preFilter,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      province: '',
      difficulty: '',
      distanceKm: distanceKm,
      typeTerrain: '',
      approvedFEDME: '',
      accessWater: ''
    })
  }

  //configuración de los filtros por cada uno de ellos
  const filtersConfig = [
    {
      name: 'province',
      label: 'Provincia',
      type: 'select',
      options: filtersOptions.province,
      defaultOption: 'Todas las provincias'
    },
    {
      name: 'difficulty',
      label: 'Dificultad',
      type: 'select',
      options: filtersOptions.difficulty,
      defaultOption: 'Dificultad'
    },
    {
      name: 'typeTerrain',
      label: 'Tipo de terreno',
      type: 'select',
      options: filtersOptions.typeTerrain,
      defaultOption: 'Tipos de terreno'
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
      defaultOption: 'Acceso a agua'
    },
    {
      name: 'distanceKm',
      label: 'Distancia máxima',
      type: 'range',
      min: 1,
      max: distanceKm
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

  if (loading) return <Loader />

  if (error) return <p>{error}</p>

  return (
    <>
      <main className="pageContainer">
        <section className="section">
          <h1 className={styles.pageTitle}>Rutas para moverse juntos</h1>
          <HikingsFilters 
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            filtersConfig={filtersConfig}
            resetFilters={resetFilters}
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
    </>
  )
}

export default HikingsPage