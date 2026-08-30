import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
import { IconRoute } from '../components/Icons.jsx'
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
      defaultOption: 'Todas las provincias',
    },
    {
      name: 'difficulty',
      label: 'Dificultad',
      type: 'select',
      options: filtersOptions.difficulty,
      defaultOption: 'Cualquier dificultad',
    },
    {
      name: 'typeTerrain',
      label: 'Tipo de terreno',
      type: 'select',
      options: filtersOptions.typeTerrain,
      defaultOption: 'Cualquier terreno',
    },
    {
      name: 'approvedFEDME',
      label: 'Homologación FEDME',
      type: 'select',
      options: filtersOptions.approvedFEDME,
      defaultOption: 'Cualquier homologación',
    },
    {
      name: 'accessWater',
      label: 'Acceso a agua',
      type: 'select',
      options: filtersOptions.accessWater,
      defaultOption: 'Cualquier acceso a agua',
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
    const chosenProvince = filters.province === '' || e.province === filters.province
    const chosenDifficulty = filters.difficulty === '' || e.difficulty === filters.difficulty
    const chosenDistance = e.distanceKm <= Number(filters.distanceKm)

    const chosenTerrain =
      filters.typeTerrain === '' ||
      (Array.isArray(e.typeTerrain)
        ? e.typeTerrain.includes(filters.typeTerrain)
        : e.typeTerrain === filters.typeTerrain)

    const chosenApproved = filters.approvedFEDME === '' || e.approvedFEDME === filters.approvedFEDME

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
    <div className="page">
      <header className="pageHeader">
        <h1>Rutas</h1>
        <p>Recorridos para moverse juntos, sin prisa.</p>
      </header>

      <FiltersPanel
        filters={filters}
        filtersConfig={filtersConfig}
        handleFiltersChange={handleFiltersChange}
        resetFilters={resetFilters}
        resultsCount={filteredHikings.length}
      />

      {filteredHikings.length === 0 ? (
        <div className={styles.empty}>
          <h2>Sin resultados</h2>
          <p className={styles.emptyText}>
            Ninguna ruta coincide con estos filtros. Prueba a quitar alguno o publica la primera.
          </p>
          <div className="stack">
            <button type="button" className="btn btn--secondary" onClick={resetFilters}>
              Limpiar filtros
            </button>
            <Link to="/hikings/new" className="btn btn--primary">Publicar una ruta</Link>
          </div>
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredHikings.map((e) => (
            <li key={e._id} className={styles.item}>
              <Link to={`/hikings/${e._id}`} className={styles.itemLink}>
                <div className={styles.thumb}>
                  {e.image ? (
                    <img src={e.image} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.thumbFallback}>
                      <IconRoute width={24} height={24} />
                    </span>
                  )}
                </div>
                <div className={styles.itemBody}>
                  <h2 className={styles.itemName}>{e.name}</h2>
                  <p className={styles.itemMeta}>
                    <span>{e.province}</span>
                    <span>{e.distanceKm} km</span>
                    {e.difficulty && <span>{e.difficulty}</span>}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HikingsPage
