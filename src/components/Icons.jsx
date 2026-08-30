// Iconos SVG propios: un único grosor de trazo (1.75) y la misma caja de 24
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const IconHome = (props) => (
  <svg {...base} {...props}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
  </svg>
)

export const IconRoute = (props) => (
  <svg {...base} {...props}>
    <path d="M4 20l4.5-9 3.5 4 3-6L20 20z" />
    <circle cx="17" cy="5" r="2" />
  </svg>
)

export const IconTent = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4 3 19h18z" />
    <path d="M12 9v10" />
  </svg>
)

export const IconPlus = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconArrowLeft = (props) => (
  <svg {...base} {...props}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </svg>
)

export const IconArrowRight = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </svg>
)

export const IconChevronDown = (props) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const IconCheck = (props) => (
  <svg {...base} {...props}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

export const IconFilter = (props) => (
  <svg {...base} {...props}>
    <path d="M3 6h18M7 12h10M10 18h4" />
  </svg>
)

export const IconClose = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const IconMap = (props) => (
  <svg {...base} {...props}>
    <path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10z" />
    <circle cx="12" cy="11" r="2.25" />
  </svg>
)
