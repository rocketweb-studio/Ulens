import {redirect} from "next/navigation";

export default function ProfilePage() {
  const isAuth = true // получаем из local storage или стора?
  const userId = 123  // получаем из local storage или стора?
  if (!isAuth) {
    redirect("/")
  } else {
    redirect(`/profile/${userId}`)
  }

  // "/profile" - редирект на мой профиль ("profile/123" - где 123 мой id) или, если не авторизован, то на "/"
}
