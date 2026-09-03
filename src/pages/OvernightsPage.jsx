import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import OvernightsFilters from '../components/OvernightsFilters.jsx'
import { getOvernightOptions } from '../services/overnightOptionsService.js'
import { getAllOvernights } from '../services/overnightsService.js'
import styles from './ListPage.module.css'


const OvernightsPage = () => {
  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [overnights, setOvernights] = useState([])

  const [filtersOptions, setFiltersOptions] = useState({
    province: [],
    services: [],
    proximity: [],
    signal: [],
    stay: [],
    limitations: []
  })

  const [filters, setFilters] = useState({
    province: '',
    services: '',
    capacity: 1,
    proximity: '',
    signal: '',
    stay: '',
    limitations: ''
  })
  
  const [loading, setLoading] =useState(true)
  const [error, setError] = useState(null)
  
  const capacity = overnights.length > 0 ? Math.max(...overnights.map((e) =>e.capacity || 1 )) : 1
  
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [overnightsArray, optionsData] = await Promise.all([
          getAllOvernights(urlAPI),
          getOvernightOptions(urlAPI)
        ])
        setOvernights(overnightsArray)

        setFiltersOptions(optionsData)

        const maxCapacity = overnightsArray.length > 0 ? Math.max(...overnightsArray.map((overnight) => overnight.capacity || 1)) : 1
      
        setFilters({
          province: '',
          services:'',
          capacity: maxCapacity,
          proximity: '',
          signal: '',
          stay: '',
          limitations: ''

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
      services: '',
      capacity: capacity,
      proximity: '',
      signal: '',
      stay: '',
      limitations: ''
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
      name: 'services',
      label: 'Servicios',
      type: 'select',
      options: filtersOptions.services,
      defaultOption: 'Servicios'
    },
    {
      name: 'proximity',
      label: 'Próximos',
      type: 'select',
      options: filtersOptions.proximity,
      defaultOption: 'Elementos cercanos'
    },
    {
      name: 'signal',
      label: 'Señal telefónica',
      type: 'select',
      options: filtersOptions.signal,
      defaultOption: 'Tipo de señal telefónica'
    },
    {
      name: 'stay',
      label: 'Estancia',
      type: 'select',
      options: filtersOptions.stay,
      defaultOption: 'Estancia'
    },
    {
      name: 'capacity',
      label: 'Capacidad del aparcamiento',
      type: 'range',
      min: 1,
      max: capacity
    },
    {
      name: 'limitations',
      label: 'Limitaciones',
      type: 'select',
      options: filtersOptions.limitations,
      defaultOption: 'Limitaciones'
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

  if (loading) return <Loader />
  if (error) return <p>{error}</p>

  return (
    <>
      <main className="pageContainer">
        <section className="section">
          <h1 className={styles.pageTitle}>Zonas de pernocta para descansar</h1>
          <OvernightsFilters 
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            filtersConfig={filtersConfig}
            resetFilters={resetFilters}
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
    </>
  )
}

export default OvernightsPage