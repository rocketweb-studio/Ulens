import s from './page.module.css'
import { PublicPage } from '@/src/feature/publicPage/ui/PublicPage'

export default async function Home() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/last`, {
    method: 'get',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 10 },
  })

  let data = await res.json()
  console.log(data)

  return (
    <div className={s.page}>
      <PublicPage data={data} />
    </div>
  )
}
