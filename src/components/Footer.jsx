import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>&copy; 2026 QAREA</p>
        <p className={styles.claim}>Go slow and see more.</p>
      </div>
    </footer>
  )
}

export default Footer
