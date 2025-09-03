import Link from 'next/link';
import s from '@/src/common/components/Navigation/Navigation.module.scss';
import {Logout} from "@/src/feature/auth/ui/Logout";

export const Path = {
    Main: '/',
    Profile: '/profile',
    Settings: '/settings',
    SignIn: '/sign-in',
    SignUp: '/sign-up',
    TermOfService: '/sign-up/term-of-service',
    PrivacyPolicy: '/sign-up/privacy-policy',
    Logout: '/logout',
    SignUpConfirmedEmail: '/sign-up/confirmed-email',
    PasswordRecovery: '/password-recovery',
    ResetPassword: '/account/reset-password',
} as const
export type PathValue = typeof Path[keyof typeof Path];

export const Navigation = () => {
    return (
        <nav className={s.navWrapper}>
            <div className={s.linksWrap}>
                <Link href={Path.Profile}>profile</Link>
                <Link href={Path.Settings}>settings</Link>
                <Link href={Path.SignIn}>Sign In</Link>
                <Link href={Path.SignUp}>Sign Up</Link>
                <Link href={Path.PasswordRecovery} >Password-recovery</Link>
                <Link href={Path.ResetPassword} >Reset-Password</Link>
                <Link href={Path.Logout}>Logout</Link>
            </div>
        </nav>
    );
}
