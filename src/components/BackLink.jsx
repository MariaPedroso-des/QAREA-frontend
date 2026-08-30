import { Link } from 'react-router-dom'
import { IconArrowLeft } from './Icons.jsx'
import styles from './BackLink.module.css'

const BackLink = ({ to, children }) => {
  return (
    <Link to={to} className={styles.back}>
      <IconArrowLeft width={18} height={18} />
      {children}
    </Link>
  )
}

export default BackLink
