import { Link, NavLink, useLocation } from 'react-router-dom'
import { IconHome, IconRoute, IconTent, IconPlus } from './Icons.jsx'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Inicio', icon: <IconHome />, end: true },
  { to: '/hikings', label: 'Rutas', icon: <IconRoute /> },
  { to: '/overnights', label: 'Pernoctas', icon: <IconTent /> },
  { to: '/formchoice', label: 'Publicar', icon: <IconPlus /> },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  
  return (
    <>
      {/* Barra superior: marca siempre, enlaces solo en pantallas grandes */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          {!isHome && (
            <Link to="/" className={styles.brand}>QAREA</Link>
          )} 

          <nav className={styles.topLinks} aria-label="Principal">
            {links.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? `${styles.topLink} ${styles.topLinkActive}` : styles.topLink
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Barra inferior: navegación principal en móvil */}
      <nav className={styles.tabbar} aria-label="Navegación principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
            }
          >
            {link.icon}
            <span className={styles.tabLabel}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Navbar
