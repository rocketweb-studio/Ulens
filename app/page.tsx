import s from './page.module.css'
import { PublicPage } from '@/src/pages/publicPage/ui/PublicPage'

export default async function Home() {
  let data = undefined
  let userCountDate = undefined
  try {
    data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/latest`, {
      next: { revalidate: 60 },
    }).then((res) => res.json())

    userCountDate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/users-count`, {
      next: { revalidate: 60 },
    }).then((res) => res.json())
  } catch (e) {
    console.log('Error', e)
  }

  return (
    <div className={s.page}>
      <PublicPage dataPosts={data} totalUsers={userCountDate?.count}/>
    </div>
  )
}
