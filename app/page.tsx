import s from './page.module.css'
import {PublicPage} from '@/src/feature/publicPage/ui/PublicPage'

export default async function Home() {

  let data = undefined

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/last`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    data = await res.json()

  } catch (e) {
    console.log('Error', e)
  }

  return (
    <div className={s.page}>
      <PublicPage data={data}/>
    </div>
  )
}
