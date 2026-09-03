import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import { getOvernightById, createOvernight, updateOvernight } from '../services/overnightsService.js'
import { getOvernightOptions } from '../services/overnightOptionsService.js'


const initialFormData = {
  name: '',
  province: '',
  description: '',
  capacity: '',
  image: '',
  mapsLink: '',
  services: [],
  proximity: [],
  signal: 'sin definir',
  stay: 'sin definir',
  limitations: []
}

const normalizeArray = (value) => {
  return Array.isArray(value) ? value : [] 
}

const validUrl = (value) => {
  if(!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const OvernightFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const  editMode = Boolean(id)

  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [formData, setFormData] = useState(initialFormData)

  const [options, setOptions] = useState({
    province: [],
    services: [],
    proximity: [],
    signal: [],
    stay: [],
    limitations: []
  })

  const [submit, setSubmit] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingOvernight, setLoadingOvernight] = useState(editMode)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setError(null)

        const optionsData = await getOvernightOptions(urlAPI)
        setOptions(optionsData)

      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar los las pociones del formulario')
      } finally {
        setLoadingOptions(false)
      }
    }
    fetchOptions()
  }, [urlAPI])

  useEffect(() => {
    if(!editMode) {
      setLoadingOvernight(false)
      return
    }

    const fetchOvernightById = async ()=> {
      try {
        setError(null)

        const data = await getOvernightById(urlAPI, id)

        setFormData({
          name: data.name || '',
          province: data.province || '',
          description: data.description || '',
          capacity: data.capacity || '',
          image: data.image || '',
          mapsLink: data.mapsLink || '',
          services: normalizeArray(data.services),
          proximity: normalizeArray(data.proximity),
          signal: data.signal || 'sin definir',
          stay: data.stay || 'sin definir',
          limitations: normalizeArray(data.limitations)
        })
      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar la zona de pernocta para editar')
      } finally {
        setLoadingOvernight(false)
      }
    }
    fetchOvernightById()
  }, [editMode, id, urlAPI])

  const handleChange = (e) => {

    const { name, value } = e.target
    
    setFormData((preFormData) => ({
    ...preFormData,
    [name]: value,
    }))
  }

  const handleArrayChange = (e) => {
    const { name, value, checked } = e.target
    
    setFormData((preFormData) => {
      const currentArray = normalizeArray(preFormData[name])

      return {
        ...preFormData,
        [name]: checked
        ? [...currentArray, value]
        : currentArray.filter((e) => e !== value)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() ||
        !formData.province ||
        !formData.description.trim() ||
        !formData.capacity  
    ) {
      setError('Hay campos obligatorios sin completar')
      return
    }
    if (formData.name.trim().length < 3) {
      setError('El campo nombre debe tener al menos 3 caracteres')
      return
    }
    
    if (!validUrl(formData.mapsLink) || !validUrl(formData.image)) {
      setError('La URL no tiene un formato válido')
      return
    }

    const payload = {
      name: formData.name,
      province: formData.province,
      description: formData.description,
      capacity: Number(formData.capacity),
      image: formData.image,
      mapsLink: formData.mapsLink,
      services: formData.services.length > 0 ? formData.services : ['sin definir'],
      proximity: formData.proximity.length > 0 ? formData.proximity : ['sin definir'],
      signal: formData.signal || 'sin definir',
      stay: formData.stay || 'sin definir',
      limitations: formData.limitations.length > 0 ? formData.limitations : ['sin definir']
    }

    try {
      setSubmit(true)

      if(editMode) {
        await updateOvernight(urlAPI, id, payload)
      } else 
        await createOvernight(urlAPI, payload)

      alert(editMode ? 'Zona de pernocta editada con éxito' : 'Zona de pernocta creada con éxito')
      navigate('/overnights')

    } catch (error) {
      console.log(error)
      setError(error.message ||  `Error al ${editMode ? 'editar' : 'crear'} la zona de pernocta`)
    } finally {
      setSubmit(false)
    }
  }
  if (loadingOptions || loadingOvernight) return <Loader />

  return (
    <>
      <main className="pageContainer">
        <section className="section">
          <h1>{editMode ? 'Editar zona de pernocta' : 'Publicar nueva pernocta'}</h1>
        </section>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name">Nombre </label>
            <input 
              id="name"
              name="name"
              type="text"
              placeholder="Nombre de la zona"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description"
              name="description"
              placeholder="Descripción de la zona"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="province">Provincia</label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required 
            >
              <option value="">Selecciona la provincia</option>
                {options.province.map((province) => {
                  return (
                  <option key={province} value={province}>
                    {province}
                    </option>
                    )
                })}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="capacity">Número aproximado de parcamientos</label>
            <input 
              id="capacity"
              name="capacity"
              placeholder="3"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              max="50"
            />
          </div>

          <fieldset className="formGroup">
            <legend>Servicios</legend>
              {options.services.map((service) => {
                return (
                  <label key={service}>
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleArrayChange}
                    />
                    {service}
                  </label>
                )
              })}
          </fieldset>

          <fieldset className="formGroup">
            <legend>Proximidad</legend>
              {options.proximity.map((proximity) => {
                return (
                  <label key={proximity}>
                    <input
                      type="checkbox"
                      name="proximity"
                      value={proximity}
                      checked={formData.proximity.includes(proximity)}
                      onChange={handleArrayChange}
                    />
                    {proximity}
                  </label>
                )
              })}
          </fieldset>

          <div className="formGroup">
            <label htmlFor="signal">Señal telefónica</label>
            <select
              id="signal"
              name="signal"
              value={formData.signal}
              onChange={handleChange}
              required 
            >
              <option value="">Selecciona la señal telefónica disponible </option>
                {options.signal.map((signal) => {
                  return (
                  <option key={signal} value={signal}>
                    {signal}
                    </option>
                    )
                })}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="stay">Limitación de estancia</label>
            <select
              id="stay"
              name="stay"
              value={formData.stay}
              onChange={handleChange}
              required 
            >
              <option value="">Selecciona la limitación de tiempo</option>
                {options.stay.map((stay) => {
                  return (
                  <option key={stay} value={stay}>
                    {stay}
                    </option>
                    )
                })}
            </select>
          </div>

          <fieldset className="formGroup">
            <legend>Limitaciones generales</legend>
              {options.limitations.map((limitation) => {
                return (
                  <label key={limitation}>
                    <input
                      type="checkbox"
                      name="limitations"
                      value={limitation}
                      checked={formData.limitations.includes(limitation)}
                      onChange={handleArrayChange}
                    />
                    {limitation}
                  </label>
                )
              })}
          </fieldset>

          <div className="formGroup">
            <label htmlFor="image">URL de la imagen</label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="formGroup">
            <label htmlFor="mapsLink">URL de la ubicación</label>
            <input
              id="mapsLink"
              name="mapsLink"
              type="url"
              value={formData.mapsLink}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {error && <p className="errorMessage">{error}</p>}
          
          <button className='btnPublish' type='submit' disabled={submit}>
            {submit 
            ? 
            (editMode ? 'Guardando...' : 'Publicando...') 
            : (editMode ? 'Guardar cambios' : 'Publicar zona de pernocta')}
          </button>
        </form>

      </main>
    </>
  )
}

export default OvernightFormPage