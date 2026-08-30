import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
import { IconTent } from '../components/Icons.jsx'
import { getAllOvernights } from '../services/overnightsService.js'
import { getOvernightOptions } from '../services/overnightOptionsService.js'

import styles from './ListPage.module.css'

const emptyFilters = {
  province: '',
  services: '',
  capacity: 1,
  proximity: '',
  signal: '',
  stay: '',
  limitations: '',
}

const OvernightsPage = () => {
  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [overnights, setOvernights] = useState([])

  const [filtersOptions, setFiltersOptions] = useState({
    province: [],
    services: [],
    proximity: [],
    signal: [],
    stay: [],
    limitations: [],
  })

  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const maxCapacity = overnights.length > 0 ? Math.max(...overnights.map((e) => e.capacity || 1)) : 1

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [overnightsArray, optionsData] = await Promise.all([
          getAllOvernights(urlAPI),
          getOvernightOptions(urlAPI),
        ])

        setOvernights(overnightsArray)
        setFiltersOptions(optionsData)

        const capacity = overnightsArray.length > 0
          ? Math.max(...overnightsArray.map((e) => e.capacity || 1))
          : 1

        setFilters({ ...emptyFilters, capacity })
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
    setFilters({ ...emptyFilters, capacity: maxCapacity })
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
      name: 'services',
      label: 'Servicios',
      type: 'select',
      options: filtersOptions.services,
      defaultOption: 'Cualquier servicio',
    },
    {
      name: 'proximity',
      label: 'Cerca de',
      type: 'select',
      options: filtersOptions.proximity,
      defaultOption: 'Cualquier entorno',
    },
    {
      name: 'signal',
      label: 'Señal telefónica',
      type: 'select',
      options: filtersOptions.signal,
      defaultOption: 'Cualquier señal',
    },
    {
      name: 'stay',
      label: 'Estancia',
      type: 'select',
      options: filtersOptions.stay,
      defaultOption: 'Cualquier estancia',
    },
    {
      name: 'limitations',
      label: 'Limitaciones',
      type: 'select',
      options: filtersOptions.limitations,
      defaultOption: 'Cualquier limitación',
    },
    {
      name: 'capacity',
      label: 'Plazas máximas',
      type: 'range',
      min: 1,
      max: maxCapacity,
      unit: 'plazas',
    },
  ]

  const filteredOvernights = overnights.filter((e) => {
    const chosenProvince = filters.province === '' || e.province === filters.province

    const chosenServices =
      filters.services === '' ||
      (Array.isArray(e.services)
        ? e.services.includes(filters.services)
        : e.services === filters.services)

    const chosenCapacity = e.capacity <= Number(filters.capacity)

    const chosenProximity =
      filters.proximity === '' ||
      (Array.isArray(e.proximity)
        ? e.proximity.includes(filters.proximity)
        : e.proximity === filters.proximity)

    const chosenSignal = filters.signal === '' || e.signal === filters.signal
    const chosenStay = filters.stay === '' || e.stay === filters.stay

    const chosenLimitations =
      filters.limitations === '' ||
      (Array.isArray(e.limitations)
        ? e.limitations.includes(filters.limitations)
        : e.limitations === filters.limitations)

    return (
      chosenProvince &&
      chosenServices &&
      chosenCapacity &&
      chosenProximity &&
      chosenSignal &&
      chosenStay &&
      chosenLimitations
    )
  })

  if (loading) return <Loader label="Cargando pernoctas" />

  if (error) {
    return (
      <div className="page">
        <header className="pageHeader">
          <h1>Pernoctas</h1>
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
        <h1>Pernoctas</h1>
        <p>Zonas donde parar, descansar y seguir mañana.</p>
      </header>

      <FiltersPanel
        filters={filters}
        filtersConfig={filtersConfig}
        handleFiltersChange={handleFiltersChange}
        resetFilters={resetFilters}
        resultsCount={filteredOvernights.length}
      />

      {filteredOvernights.length === 0 ? (
        <div className={styles.empty}>
          <h2>Sin resultados</h2>
          <p className={styles.emptyText}>
            Ninguna zona coincide con estos filtros. Prueba a quitar alguno o publica la primera.
          </p>
          <button type="button" className="btn btn--secondary" onClick={resetFilters}>
            Limpiar filtros
          </button>
          <Link to="/overnights/new" className="btn btn--primary">Publicar una pernocta</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredOvernights.map((e) => (
            <li key={e._id} className={styles.item}>
              <Link to={`/overnights/${e._id}`} className={styles.itemLink}>
                <div className={styles.thumb}>
                  {e.image ? (
                    <img src={e.image} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.thumbFallback}>
                      <IconTent width={24} height={24} />
                    </span>
                  )}
                </div>
                <div className={styles.itemBody}>
                  <h2 className={styles.itemName}>{e.name}</h2>
                  <p className={styles.itemMeta}>
                    <span>{e.province}</span>
                    <span>{e.capacity} {e.capacity === 1 ? 'plaza' : 'plazas'}</span>
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

export default OvernightsPage
