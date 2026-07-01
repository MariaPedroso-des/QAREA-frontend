import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerCopy}>&copy; 2026 QAREA. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer