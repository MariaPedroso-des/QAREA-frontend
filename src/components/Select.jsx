import { useEffect, useId, useRef, useState } from 'react'
import { IconChevronDown, IconCheck } from './Icons.jsx'
import styles from './Select.module.css'

/*
  Desplegable propio (patrón button + listbox).
  Emite el mismo evento que un <select> nativo: { target: { name, value } },
  así los handlers existentes siguen funcionando sin cambios.
*/
const Select = ({
  id,
  name,
  label,
  value,
  options = [],
  placeholder = 'Selecciona una opción',
  onChange,
  hideLabel = false,
  disabled = false,
}) => {
  const generatedId = useId()
  const fieldId = id || `${generatedId}-select`
  const labelId = `${fieldId}-label`
  const listId = `${fieldId}-list`

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const typeahead = useRef({ text: '', timer: 0 })

  const items = [{ value: '', text: placeholder }, ...options.map((o) => ({ value: o, text: o }))]
  const selectedIndex = Math.max(items.findIndex((item) => item.value === value), 0)
  const selectedText = items[selectedIndex].text

  const openList = (index = selectedIndex) => {
    if (disabled) return
    setActiveIndex(index)
    setOpen(true)
  }

  const closeList = ({ focusButton = true } = {}) => {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  const selectIndex = (index) => {
    const item = items[index]
    if (!item) return
    onChange?.({ target: { name, value: item.value } })
    closeList()
  }

  useEffect(() => {
    if (!open) return

    listRef.current?.focus()

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const active = listRef.current?.querySelector(`#${CSS.escape(`${listId}-opt-${activeIndex}`)}`)
    active?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex, listId])

  const handleButtonKeyDown = (event) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openList()
    }
  }

  const handleTypeahead = (key) => {
    window.clearTimeout(typeahead.current.timer)
    typeahead.current.text += key.toLowerCase()
    typeahead.current.timer = window.setTimeout(() => {
      typeahead.current.text = ''
    }, 600)

    const match = items.findIndex((item) => item.text.toLowerCase().startsWith(typeahead.current.text))
    if (match >= 0) setActiveIndex(match)
  }

  const handleListKeyDown = (event) => {
    const { key } = event

    if (key === 'Escape' || key === 'Tab') {
      closeList()
      return
    }

    if (key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, items.length - 1))
      return
    }

    if (key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
      return
    }

    if (key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
      return
    }

    if (key === 'End') {
      event.preventDefault()
      setActiveIndex(items.length - 1)
      return
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      selectIndex(activeIndex)
      return
    }

    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      handleTypeahead(key)
    }
  }

  return (
    <div className={styles.field} ref={wrapRef}>
      <label
        id={labelId}
        htmlFor={fieldId}
        className={hideLabel ? 'visuallyHidden' : styles.label}
      >
        {label}
      </label>

      <button
        type="button"
        id={fieldId}
        ref={buttonRef}
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${fieldId}`}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={value ? styles.valueText : styles.placeholderText}>{selectedText}</span>
        <IconChevronDown className={open ? styles.chevronOpen : styles.chevron} />
      </button>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={styles.list}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-opt-${activeIndex}`}
          onKeyDown={handleListKeyDown}
        >
          {items.map((item, index) => {
            const isSelected = index === selectedIndex
            const isActive = index === activeIndex

            return (
              <li
                key={item.value || 'placeholder'}
                id={`${listId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectIndex(index)}
              >
                <span className={item.value ? undefined : styles.placeholderText}>{item.text}</span>
                {isSelected && item.value ? <IconCheck width={18} height={18} /> : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Select
