import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <>
      <a className="skipLink" href="#main">Ir al contenido</a>
      <Navbar />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
