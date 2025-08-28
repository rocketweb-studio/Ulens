import Link from 'next/link';
import s from '@/src/common/components/Navigation/Navigation.module.scss';

export const Path = {
    Main: '/',
    Profile: '/profile',
    Settings: '/settings',
    SignIn: '/sign-in',
    SignUp: '/sign-up',
} as const

export const Navigation = () => {
    return (
        <nav className={s.navWrapper}>
            <div className={s.logotype}><Link href={Path.Main}>Ulens</Link></div>
            <div className={s.linksWrap}>
                <Link href={Path.Profile}>profile</Link>
                <Link href={Path.Settings}>settings</Link>
                <Link href={Path.SignIn}>login</Link>
                <Link href={Path.SignUp}>Sign Up</Link>
            </div>
        </nav>
    );
}