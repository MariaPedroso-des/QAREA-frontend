import { useId, useState } from 'react'
import Select from './Select.jsx'
import { IconFilter, IconClose } from './Icons.jsx'
import styles from './Filters.module.css'

/*
  Panel de filtros común a rutas y pernoctas.
  En móvil está plegado: se abre con un botón y ocupa el ancho completo.
  A partir de tablet se muestra siempre en rejilla.
*/
const FiltersPanel = ({ filters, filtersConfig, handleFiltersChange, resetFilters, resultsCount }) => {
  const [open, setOpen] = useState(false)
  const panelId = `${useId()}-filters`

  const activeCount = filtersConfig.reduce((total, filter) => {
    const value = filters[filter.name]
    if (filter.type === 'select') return total + (value ? 1 : 0)
    if (filter.type === 'range') return total + (Number(value) < Number(filter.max) ? 1 : 0)
    return total
  }, 0)

  return (
    <section className={styles.wrap} aria-label="Filtros">
      <div className={styles.bar}>
        <button
          type="button"
          className={`btn btn--secondary ${styles.toggle}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose /> : <IconFilter />}
          {open ? 'Cerrar filtros' : 'Filtrar'}
          {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        </button>

        <p className={styles.count} aria-live="polite">
          {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      <div id={panelId} className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
        <div className={styles.grid}>
          {filtersConfig.map((filter) => {
            if (filter.type === 'select') {
              return (
                <Select
                  key={filter.name}
                  name={filter.name}
                  label={filter.label}
                  value={filters[filter.name]}
                  options={filter.options}
                  placeholder={filter.defaultOption}
                  onChange={handleFiltersChange}
                />
              )
            }

            if (filter.type === 'range') {
              return (
                <div key={filter.name} className={styles.rangeField}>
                  <label htmlFor={filter.name} className={styles.rangeLabel}>
                    <span>{filter.label}</span>
                    <span className={styles.rangeValue}>
                      {filters[filter.name]}{filter.unit ? ` ${filter.unit}` : ''}
                    </span>
                  </label>
                  <input
                    className={styles.range}
                    type="range"
                    id={filter.name}
                    name={filter.name}
                    min={filter.min}
                    max={filter.max}
                    step="1"
                    value={filters[filter.name]}
                    onChange={handleFiltersChange}
                  />
                </div>
              )
            }

            return null
          })}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={resetFilters}
            disabled={activeCount === 0}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </section>
  )
}

export default FiltersPanel
