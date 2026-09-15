const Loader = ({ label = 'Cargando' }) => {
  return (
    <div className="loaderContainer" role="status" aria-live="polite">
      <span className="visuallyHidden">{label}</span>
      <div className="waveDots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default Loader
