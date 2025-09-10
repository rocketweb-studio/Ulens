import Link from 'next/link'
import s from '@/src/shared/components/Navigation/Navigation.module.scss'
import {Path} from "@/src/shared/constants/Path";

export const Navigation = () => {
  return (
    <nav className={s.navWrapper}>
      <div className={s.linksWrap}>
        <Link href={Path.Profile}>profile</Link>
        <Link href={Path.Settings}>settings</Link>
        <Link href={Path.SignIn}>Sign In</Link>
        <Link href={Path.SignUp}>Sign Up</Link>
        <Link href={Path.PasswordRecovery}>Password-recovery</Link>
        <Link href={Path.ResetPassword}>Reset-Password</Link>
        <Link href={Path.Logout}>Logout</Link>
      </div>
    </nav>
  )
}
