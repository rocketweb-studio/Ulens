import { redirect } from "next/navigation"

export default function ProfilePage() {
  const isAuth = true // получаем из local storage или стора?
  const userId = 123 // получаем из local storage или стора?
  if (!isAuth) {
    redirect("/")
  } else {
    redirect(`/profile/${userId}`)
  }
}
