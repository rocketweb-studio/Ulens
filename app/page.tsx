import styles from './page.module.css'
import { PublicPage } from '@/src/feature/publicPage/PublicPage'

export default function Home() {
  return (
    <div className={styles.page}>
      <PublicPage />
    </div>
  )
}
