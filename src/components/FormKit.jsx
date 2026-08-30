import styles from './FormKit.module.css'

export const Stepper = ({ steps, current }) => {
  const total = steps.length

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperHead}>
        <p className={styles.stepCount}>Paso {current + 1} de {total}</p>
        <p className={styles.stepName}>{steps[current]}</p>
      </div>

      <ol className={styles.stepTrack} aria-label="Progreso del formulario">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`${styles.stepBar} ${index <= current ? styles.stepBarDone : ''}`}
            aria-current={index === current ? 'step' : undefined}
          >
            <span className="visuallyHidden">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export const Field = ({ id, label, hint, children }) => (
  <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    {children}
    {hint && <p className={styles.hint}>{hint}</p>}
  </div>
)

export const CheckGroup = ({ legend, name, options, selected, onChange, hint }) => (
  <fieldset className={styles.field}>
    <legend>{legend}</legend>
    {hint && <p className={styles.hint}>{hint}</p>}
    <div className={styles.chips}>
      {options.map((option) => {
        const isChecked = selected.includes(option)

        return (
          <label
            key={option}
            className={`${styles.chip} ${isChecked ? styles.chipOn : ''}`}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={isChecked}
              onChange={onChange}
            />
            {option}
          </label>
        )
      })}
    </div>
  </fieldset>
)

export const FormActions = ({ children }) => (
  <div className={styles.actions}>{children}</div>
)
