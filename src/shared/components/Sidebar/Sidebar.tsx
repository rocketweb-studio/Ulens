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
  IconLogOutOutline,
  IconMessageCircleOutline,
  IconPerson,
  IconPersonOutline,
  IconPlusSquare,
  IconPlusSquareOutline,
  IconSearch,
  IconTrendingUpOutline,
} from '@rocketweb-studio/ulens-ui-kit'
import { Suspense, useState } from 'react'
import { ConfirmLogout } from '@/src/feature/auth/ui/Logout/ConfirmLogout'

function SidebarContent() {
  const { data, isSuccess } = useGetMeQuery()
  const pathname = usePathname()
  const params = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!isSuccess) {
    return null
  }

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
      <FlexContainer className={s.linkWrapper} gap={'13px'}>
        <button onClick={() => setIsModalOpen(!isModalOpen)} className={s.logoutBtn}>
          <IconLogOutOutline className={s.icon} />
          Log Out
        </button>
      </FlexContainer>
      <ConfirmLogout isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={data?.email ?? ''} />
    </div>
  )
}

export const Sidebar = () => {
  return (
    <Suspense
      fallback={
        <div className={s.sidebarWrapper}>
          <div>Loading sidebar...</div>
        </div>
      }
    >
      <SidebarContent />
    </Suspense>
  )
}
