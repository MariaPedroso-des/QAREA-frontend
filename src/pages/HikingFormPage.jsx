import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import { getHikingOptions } from '../services/hikingOptionsService.js'
import { getHikingById, createHiking, updateHiking } from '../services/hikingsService.js'

const initialFormData = {
    name: '',
    province: '',
    difficulty: 'sin definir',
    distanceKm: '',
    typeTerrain: [],
    description: '',
    image: '',
    approvedFEDME: 'sin homologación',
    mapsLink: '',
    accessWater: []
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

const HikingFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const editMode = Boolean(id)

  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [formData, setFormData] = useState(initialFormData)

  const [options, setOptions] = useState({
    province: [],
    difficulty: [],
    typeTerrain: [],
    approvedFEDME: [],
    accessWater: []
  })

  const [submit, setSubmit] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingHiking, setLoadingHiking] = useState(editMode)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setError(null)

        const optionsData = await getHikingOptions(urlAPI)
        setOptions(optionsData)

      } catch (error) {
        console.log(error)
        setError(error.message ||'Error al cargar los las opciones del formulario')
      } finally {
        setLoadingOptions(false)
      }
    }
    fetchOptions()
  }, [urlAPI])

  useEffect(() => {
    if(!editMode) {
      setLoadingHiking(false)
      return
    }

    const fetchHikingById = async () => {
      try {
        setError(null)

        const data = await getHikingById(urlAPI, id)

        setFormData({
          name: data.name || '',
          province: data.province || '',
          difficulty: data.difficulty || '',
          distanceKm: data.distanceKm || '',
          typeTerrain: normalizeArray(data.typeTerrain),
          description: data.description || '',
          image: data.image || '',
          approvedFEDME: data.approvedFEDME || '',
          mapsLink: data.mapsLink || '',
          accessWater: normalizeArray(data.accessWater)
        })

      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar la ruta para editar')
      } finally {
        setLoadingHiking(false)
      }
    }
    fetchHikingById()
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
        !formData.distanceKm  
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
      difficulty: formData.difficulty || 'sin definir',
      distanceKm: Number(formData.distanceKm),
      typeTerrain: formData.typeTerrain.length > 0 ? formData.typeTerrain : ['sin definir'],
      description: formData.description,
      image: formData.image,
      approvedFEDME: formData.approvedFEDME || 'sin homologación',
      mapsLink: formData.mapsLink,
      accessWater: formData.accessWater.length > 0 ? formData.accessWater : ['sin definir']
    }

    try {
      setSubmit(true)

      if(editMode) {
        await updateHiking(urlAPI, id, payload)
      } else {
        await createHiking(urlAPI, payload)
      }

      alert(editMode ? 'Ruta editada con éxito' : 'Ruta creada con éxito')
      navigate('/hikings')

    } catch (error) {
      console.log(error)
      setError(error.message || `Error al ${editMode ? 'editar' : 'crear'} la ruta`)
    } finally {
      setSubmit(false)
    }
  }
  if (loadingOptions || loadingHiking) return <Loader />

  return (
    <>
      <main className="pageContainer">
        <section className="section">
          <h1>{editMode ? 'Editar ruta' : 'Publicar nueva ruta'}</h1>
        </section>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name">Nombre</label>
            <input 
              id="name"
              name="name"
              type="text"
              placeholder="Nombre de la ruta"
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
              placeholder="Descripción de la ruta"
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
            <label htmlFor="difficulty">Dificultad</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required 
            >
              <option value="">Selecciona la dificultad de la ruta</option>
                {options.difficulty.map((difficulty) => {
                  return (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                    </option>
                    )
                })}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="distanceKm">Distancia en kilómetros</label>
            <input 
              id="distanceKm"
              name="distanceKm"
              placeholder="9.5"
              type="number"
              value={formData.distanceKm}
              onChange={handleChange}
              required
              min="1"
              max="50"
              step="0.1"
            />
          </div>

          <fieldset className="formGroup">
            <legend>Tipos de terreno</legend>
              {options.typeTerrain.map((terrain) => {
                return (
                  <label key={terrain}>
                    <input
                      type="checkbox"
                      name="typeTerrain"
                      value={terrain}
                      checked={formData.typeTerrain.includes(terrain)}
                      onChange={handleArrayChange}
                    />
                    {terrain}
                  </label>
                )
              })}
          </fieldset>
          
          <div className="formGroup">
            <label htmlFor="approvedFEDME">Homologación FEDME</label>
            <select
              id="approvedFEDME"
              name="approvedFEDME"
              value={formData.approvedFEDME}
              onChange={handleChange}
            >
              <option value="">Selecciona el tipo de homologación</option>
                {options.approvedFEDME.map((approved) => {
                  return (
                  <option key={approved} value={approved}>
                    {approved}
                    </option>
                    )
                })}
            </select>
          </div>

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

          <fieldset className="formGroup">
            <legend>Accesos al agua</legend>
              {options.accessWater.map((water) => {
                return (
                  <label key={water}>
                    <input
                      type="checkbox"
                      name="accessWater"
                      value={water}
                      checked={formData.accessWater.includes(water)}
                      onChange={handleArrayChange}
                    />
                    {water}
                  </label>
                )
              })}
          </fieldset>

          {error && <p className="errorMessage">{error}</p>}
          
          <button className='btnPublish' type='submit' disabled={submit}>
            {submit
            ? (editMode ? 'Guardando...' : 'Publicando...')
            : (editMode ? 'Guardar cambios' : 'Publicar ruta')}
          </button>
        </form>
      </main>
    </>
  )
}


export default HikingFormPage