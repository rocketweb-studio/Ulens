'use client'

import s from './Sidebar.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/constants/Path'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  IconBookmarkOutline,
  IconHome,
  IconHomeOutline,
  IconLogOut,
  IconLogOutOutline,
  IconMessageCircleOutline,
  IconPerson,
  IconPersonOutline,
  IconPlusSquare,
  IconPlusSquareOutline,
  IconSearch,
  IconTrendingUpOutline,
} from '@rocketweb-studio/ulens-ui-kit'

export const Sidebar = () => {
  const { data } = useGetMeQuery()
  const pathname = usePathname()
  const params = useSearchParams()

  if (!data?.id) return null

  const sidebarLinks = [
    {
      icon: pathname === Path.Main ? IconHome : IconHomeOutline,
      title: 'Feed',
      href: Path.Main,
      isActive: pathname === Path.Main,
    },
    {
      icon:
        pathname === Path.UserProfile(data?.id) && params.get('action') === 'create' ?
          IconPlusSquare
        : IconPlusSquareOutline,
      title: 'Create',
      href: Path.UserCreate(data?.id),
      isActive: pathname === Path.UserProfile(data?.id) && params.get('action') === 'create',
    },
    {
      icon: pathname === Path.UserProfile(data?.id) && params.size === 0 ? IconPerson : IconPersonOutline,
      title: 'My Profile',
      href: Path.UserProfile(data?.id),
      isActive: pathname === Path.UserProfile(data?.id) && params.size === 0,
    },
    { icon: IconMessageCircleOutline, title: 'Messenger', href: Path.InDevelopment },
    { icon: IconSearch, title: 'Search', href: Path.InDevelopment },
    { icon: IconTrendingUpOutline, title: 'Statistics', href: Path.InDevelopment },
    { icon: IconBookmarkOutline, title: 'Favorites', href: Path.InDevelopment },
    {
      icon: pathname === Path.Logout ? IconLogOut : IconLogOutOutline,
      title: 'Log Out',
      href: Path.Logout,
      isActive: pathname === Path.Logout,
    },
  ]

  return (
    <div className={s.sidebarWrapper}>
      {sidebarLinks.map(({ title, href, isActive, icon: Icon }, i) => (
        <FlexContainer className={s.linkWrapper} gap={'13px'} key={i}>
          <Link href={href} className={`${s.link} ${isActive ? s.activeLink : ''}`}>
            <Icon className={s.icon} />
            {title}
          </Link>
        </FlexContainer>
      ))}
    </div>
  )
}
