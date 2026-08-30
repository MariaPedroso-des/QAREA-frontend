import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loader from '../components/Loader.jsx'
import BackLink from '../components/BackLink.jsx'
import Select from '../components/Select.jsx'
import { Stepper, Field, CheckGroup, FormActions } from '../components/FormKit.jsx'
import { getOvernightOptions } from '../services/overnightOptionsService.js'
import { getOvernightById, createOvernight, updateOvernight } from '../services/overnightsService.js'

import styles from './FormPage.module.css'

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
  limitations: [],
}

const steps = ['Lo básico', 'Servicios y entorno', 'Imagen y mapa']

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

const OvernightFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const editMode = Boolean(id)

  const urlAPI = import.meta.env.VITE_APP_API_URL

  const [formData, setFormData] = useState(initialFormData)
  const [step, setStep] = useState(0)

  const [options, setOptions] = useState({
    province: [],
    services: [],
    proximity: [],
    signal: [],
    stay: [],
    limitations: [],
  })

  const [submit, setSubmit] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingOvernight, setLoadingOvernight] = useState(editMode)
  const [error, setError] = useState(null)

  const stepTitleRef = useRef(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setError(null)
        const optionsData = await getOvernightOptions(urlAPI)
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

    const fetchOvernightById = async () => {
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
          limitations: normalizeArray(data.limitations),
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
      if (!formData.name.trim()) return 'Escribe el nombre de la zona'
      if (formData.name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
      if (!formData.province) return 'Elige la provincia de la zona'
      if (!formData.description.trim()) return 'Añade una descripción de la zona'
      if (!formData.capacity) return 'Indica cuántas plazas de aparcamiento hay'
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
      description: formData.description,
      capacity: Number(formData.capacity),
      image: formData.image,
      mapsLink: formData.mapsLink,
      services: formData.services.length > 0 ? formData.services : ['sin definir'],
      proximity: formData.proximity.length > 0 ? formData.proximity : ['sin definir'],
      signal: formData.signal || 'sin definir',
      stay: formData.stay || 'sin definir',
      limitations: formData.limitations.length > 0 ? formData.limitations : ['sin definir'],
    }

    try {
      setError(null)
      setSubmit(true)

      if (editMode) {
        await updateOvernight(urlAPI, id, payload)
        navigate(`/overnights/${id}`)
      } else {
        const created = await createOvernight(urlAPI, payload)
        navigate(created?._id ? `/overnights/${created._id}` : '/overnights')
      }
    } catch (error) {
      console.log(error)
      setError(error.message || `Error al ${editMode ? 'editar' : 'crear'} la zona de pernocta`)
      setSubmit(false)
    }
  }

  if (loadingOptions || loadingOvernight) return <Loader label="Cargando formulario" />

  const isLastStep = step === steps.length - 1

  return (
    <div className="page page--narrow">
      <BackLink to={editMode ? `/overnights/${id}` : '/formchoice'}>
        {editMode ? 'Volver a la pernocta' : 'Volver'}
      </BackLink>

      <header className="pageHeader">
        <h1>{editMode ? 'Editar pernocta' : 'Publicar una pernocta'}</h1>
      </header>

      <Stepper steps={steps} current={step} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {step === 0 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>Lo básico</h2>
              <p className={styles.stepIntro}>Cómo se llama la zona, dónde está y cuánto cabe.</p>
            </div>

            <Field id="name" label="Nombre de la zona">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Mirador de la Sierra"
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
              hint="Cómo es el sitio, el firme y qué conviene saber al llegar."
            >
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Explanada de tierra llana, tranquila por la noche..."
                value={formData.description}
                onChange={handleChange}
              />
            </Field>

            <Field id="capacity" label="Plazas de aparcamiento" hint="Número aproximado.">
              <input
                id="capacity"
                name="capacity"
                type="number"
                inputMode="numeric"
                placeholder="3"
                min="1"
                max="50"
                value={formData.capacity}
                onChange={handleChange}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>Servicios y entorno</h2>
              <p className={styles.stepIntro}>Qué hay en la zona y qué limitaciones tiene.</p>
            </div>

            <CheckGroup
              legend="Servicios"
              name="services"
              options={options.services}
              selected={formData.services}
              onChange={handleArrayChange}
              hint="Puedes elegir varios."
            />

            <CheckGroup
              legend="Cerca de"
              name="proximity"
              options={options.proximity}
              selected={formData.proximity}
              onChange={handleArrayChange}
              hint="Puedes elegir varios."
            />

            <Select
              name="signal"
              label="Señal telefónica"
              value={formData.signal}
              options={options.signal}
              placeholder="Elige la señal disponible"
              onChange={handleChange}
            />

            <Select
              name="stay"
              label="Limitación de estancia"
              value={formData.stay}
              options={options.stay}
              placeholder="Elige la limitación de tiempo"
              onChange={handleChange}
            />

            <CheckGroup
              legend="Limitaciones generales"
              name="limitations"
              options={options.limitations}
              selected={formData.limitations}
              onChange={handleArrayChange}
              hint="Puedes elegir varias."
            />
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.stepHead}>
              <h2 className={styles.stepTitle} tabIndex={-1} ref={stepTitleRef}>Imagen y mapa</h2>
              <p className={styles.stepIntro}>Opcional, pero ayuda mucho a quien la busque.</p>
            </div>

            <Field id="image" label="URL de la imagen" hint="Enlace a una foto de la zona.">
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

            <Field id="mapsLink" label="URL de la ubicación" hint="Enlace al punto exacto.">
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
                <span className={styles.summaryLabel}>Plazas</span>
                <span className={styles.summaryValue}>{formData.capacity || '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Servicios</span>
                <span className={styles.summaryValue}>
                  {formData.services.length > 0 ? formData.services.join(', ') : '—'}
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
                : (editMode ? 'Guardar cambios' : 'Publicar pernocta')}
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

export default OvernightFormPage
