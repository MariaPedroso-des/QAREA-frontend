import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import FiltersPanel from '../components/FiltersPanel.jsx'
/*import { IconTent } from '../components/Icons.jsx'*/
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
    const { name, value } =e.target
    setFilters((preFilter) => ({
      ...preFilter,
      [name]: value,
    }))
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
      defaultOption: 'Dónde quieres ir',
    },
    {
      name: 'services',
      label: 'Servicios',
      type: 'select',
      options: filtersOptions.services,
      defaultOption: 'Qué servicios necesitas',
    },
    {
      name: 'proximity',
      label: 'Próximos',
      type: 'select',
      options: filtersOptions.proximity,
      defaultOption: 'Qué hay cerca',
    },
    {
      name: 'signal',
      label: 'Señal telefónica',
      type: 'select',
      options: filtersOptions.signal,
      defaultOption: 'Qué cobertura necesitas',
    },
    {
      name: 'stay',
      label: 'Estancia',
      type: 'select',
      options: filtersOptions.stay,
      defaultOption: 'Cuánto tiempo quieres quedarte',
    },
    {
      name: 'capacity',
      label: 'Capacidad del aparcamiento',
      type: 'range',
      min: 1,
      max: maxCapacity,
      unit: 'plazas',
    },
    {
      name: 'limitations',
      label: 'Limitaciones',
      type: 'select',
      options: filtersOptions.limitations,
      defaultOption: 'Qué limitaciones tiene',
    }
  ]

  const filteredOvernights = overnights.filter((e) => {
    const chosenProvince = 
      filters.province === '' || e.province === filters.province
    
    const chosenServices = 
      filters.services === '' ||
      (Array.isArray(e.services)
      ? e.services.includes(filters.services)
      : e.services === filters.services)
  
    const chosenCapacity = 
      e.capacity <= Number(filters.capacity)
  
    const chosenProximity = 
      filters.proximity === '' || 
      (Array.isArray(e.proximity) 
      ? e.proximity.includes(filters.proximity) 
      : e.proximity === filters.proximity)
  
    const chosenSignal = 
      filters.signal === '' || e.signal === filters.signal
  
    const chosenStay = 
      filters.stay === '' || e.stay === filters.stay

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
      <main className="page">
        <section className="section">
          <h1 className={styles.pageTitle}>Zonas de pernocta para descansar</h1>
          <FiltersPanel 
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            filtersConfig={filtersConfig}
            resetFilters={resetFilters}
            resultCount={filteredOvernights.length}
          />
        <section className={styles.cardsGrid}>
          {filteredOvernights.length === 0 ? (
            <p className={styles.emptyState}>Aún no existen zonas de pernocta que coincidan con tu búsqueda</p>
          ) : (
            filteredOvernights.map((e) => (
              <article key={e._id} className={styles.itemCard}>
                  <Link to={`/overnights/${e._id}`} className={styles.cardLink}>
                  <div className={styles.cardThumb}>
                    {e.image ? (<img src={e.image} alt={e.name} />) : null}
                  </div>
                  <div>
                    <h2 className={styles.cardName}>{e.name}</h2>
                    <p className={styles.cardInfo}>{e.province}</p>
                    <p className={styles.cardInfo}>{e.capacity}</p>
                  </div>
                  </Link>

              </article>
            ))
          )}
        </section>

        </section>

      </main>
  )
}

export default OvernightsPage