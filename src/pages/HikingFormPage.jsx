import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import BackLink from '../components/BackLink.jsx'
import Select from '../components/Select.jsx'
import { Stepper, Field, CheckGroup, FormActions } from '../components/FormKit.jsx'
import { getHikingOptions } from '../services/hikingOptionsService.js'
import { getHikingById, createHiking, updateHiking } from '../services/hikingsService.js'

import styles from './FormPage.module.css'

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
  accessWater: [],
}

const steps = ['Lo básico', 'La ruta', 'Imagen y mapa']

const normalizeArray = (value) => (Array.isArray(value) ? value : [])

const validUrl = (value) => {
  if (!value) return true

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
  const [step, setStep] = useState(0)

  const [options, setOptions] = useState({
    province: [],
    difficulty: [],
    typeTerrain: [],
    approvedFEDME: [],
    accessWater: [],
  })

  const [submit, setSubmit] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingHiking, setLoadingHiking] = useState(editMode)
  const [error, setError] = useState(null)

  const stepTitleRef = useRef(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setError(null)
        const optionsData = await getHikingOptions(urlAPI)
        setOptions(optionsData)
      } catch (error) {
        console.log(error)
        setError(error.message || 'Error al cargar las opciones del formulario')
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [urlAPI])

  useEffect(() => {
    if (!editMode) return

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
          accessWater: normalizeArray(data.accessWater),
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

  useEffect(() => {
    window.scrollTo({ top: 0 })
    stepTitleRef.current?.focus()
  }, [step])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((preFormData) => ({ ...preFormData, [name]: value }))
  }

  const handleArrayChange = (e) => {
    const { name, value, checked } = e.target

    setFormData((preFormData) => {
      const currentArray = normalizeArray(preFormData[name])

      return {
        ...preFormData,
        [name]: checked
          ? [...currentArray, value]
          : currentArray.filter((item) => item !== value),
      }
    })
  }

  // Cada paso valida solo sus propios campos
  const validateStep = (index) => {
    if (index === 0) {
      if (!formData.name.trim()) return 'Escribe el nombre de la ruta'
      if (formData.name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
      if (!formData.province) return 'Elige la provincia de la ruta'
      if (!formData.description.trim()) return 'Añade una descripción de la ruta'
    }

    if (index === 1) {
      if (!formData.distanceKm) return 'Indica la distancia de la ruta en kilómetros'
    }

    if (index === 2) {
      if (!validUrl(formData.image)) return 'La URL de la imagen no es válida'
      if (!validUrl(formData.mapsLink)) return 'La URL de la ubicación no es válida'
    }

    return null
  }

  const goNext = () => {
    const stepError = validateStep(step)

    if (stepError) {
      setError(stepError)
      return
    }

    setError(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const goBack = () => {
    setError(null)
    setStep((current) => Math.max(current - 1, 0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step < steps.length - 1) {
      goNext()
      return
    }

    for (let index = 0; index < steps.length; index += 1) {
      const stepError = validateStep(index)

      if (stepError) {
        setError(stepError)
        setStep(index)
        return
      }
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
      accessWater: formData.accessWater.length > 0 ? formData.accessWater : ['sin definir'],
    }

    try {
      setError(null)
      setSubmit(true)

      if (editMode) {
        await updateHiking(urlAPI, id, payload)
        navigate(`/hikings/${id}`)
      } else {
        const created = await createHiking(urlAPI, payload)
        navigate(created?._id ? `/hikings/${created._id}` : '/hikings')
      }
    } catch (error) {
      console.log(error)
      setError(error.message || `Error al ${editMode ? 'editar' : 'crear'} la ruta`)
      setSubmit(false)
    }
  }

  if (loadingOptions || loadingHiking) return <Loader label="Cargando formulario" />

  const isLastStep = step === steps.length - 1

  return (
    <div className="page page--narrow">
      <BackLink to={editMode ? `/hikings/${id}` : '/formchoice'}>
        {editMode ? 'Volver a la ruta' : 'Volver'}
      </BackLink>

      <header className="pageHeader">
        <h1>{editMode ? 'Editar ruta' : 'Publicar una ruta'}</h1>
      </header>

      <Stepper steps={steps} current={step} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {step === 0 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>Lo básico</h2>
              <p className={styles.stepIntro}>Cómo se llama la ruta y dónde está.</p>
            </div>

            <Field id="name" label="Nombre de la ruta">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Cascadas del Purgatorio"
                value={formData.name}
                onChange={handleChange}
              />
            </Field>

            <Select
              name="province"
              label="Provincia"
              value={formData.province}
              options={options.province}
              placeholder="Elige la provincia"
              onChange={handleChange}
            />

            <Field
              id="description"
              label="Descripción"
              hint="Cuenta cómo es el recorrido y qué hay que tener en cuenta con perrete."
            >
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Sendero de tierra a la sombra, con varios tramos junto al río..."
                value={formData.description}
                onChange={handleChange}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>La ruta</h2>
              <p className={styles.stepIntro}>Distancia, terreno y agua por el camino.</p>
            </div>

            <Field id="distanceKm" label="Distancia (km)">
              <input
                id="distanceKm"
                name="distanceKm"
                type="number"
                inputMode="decimal"
                placeholder="9.5"
                min="1"
                max="50"
                step="0.1"
                value={formData.distanceKm}
                onChange={handleChange}
              />
            </Field>

            <Select
              name="difficulty"
              label="Dificultad"
              value={formData.difficulty}
              options={options.difficulty}
              placeholder="Elige la dificultad"
              onChange={handleChange}
            />

            <CheckGroup
              legend="Tipo de terreno"
              name="typeTerrain"
              options={options.typeTerrain}
              selected={formData.typeTerrain}
              onChange={handleArrayChange}
              hint="Puedes elegir varios."
            />

            <CheckGroup
              legend="Acceso a agua"
              name="accessWater"
              options={options.accessWater}
              selected={formData.accessWater}
              onChange={handleArrayChange}
              hint="Puedes elegir varios."
            />

            <Select
              name="approvedFEDME"
              label="Homologación FEDME"
              value={formData.approvedFEDME}
              options={options.approvedFEDME}
              placeholder="Elige el tipo de homologación"
              onChange={handleChange}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>Imagen y mapa</h2>
              <p className={styles.stepIntro}>Opcional, pero ayuda mucho a quien la busque.</p>
            </div>

            <Field id="image" label="URL de la imagen" hint="Enlace a una foto de la ruta.">
              <input
                id="image"
                name="image"
                type="url"
                inputMode="url"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />
            </Field>

            <Field id="mapsLink" label="URL de la ubicación" hint="Enlace al inicio de la ruta.">
              <input
                id="mapsLink"
                name="mapsLink"
                type="url"
                inputMode="url"
                placeholder="https://..."
                value={formData.mapsLink}
                onChange={handleChange}
              />
            </Field>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Nombre</span>
                <span className={styles.summaryValue}>{formData.name || '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Provincia</span>
                <span className={styles.summaryValue}>{formData.province || '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Distancia</span>
                <span className={styles.summaryValue}>
                  {formData.distanceKm ? `${formData.distanceKm} km` : '—'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Terreno</span>
                <span className={styles.summaryValue}>
                  {formData.typeTerrain.length > 0 ? formData.typeTerrain.join(', ') : '—'}
                </span>
              </div>
            </div>
          </>
        )}

        {error && <p className="errorMessage" role="alert">{error}</p>}

        <FormActions>
          {step > 0 ? (
            <button type="button" className="btn btn--secondary" onClick={goBack} disabled={submit}>
              Atrás
            </button>
          ) : (
            <span />
          )}

          {isLastStep ? (
            <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={submit}>
              {submit
                ? (editMode ? 'Guardando...' : 'Publicando...')
                : (editMode ? 'Guardar cambios' : 'Publicar ruta')}
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={goNext}>
              Siguiente
            </button>
          )}
        </FormActions>
      </form>
    </div>
  )
}

export default HikingFormPage
