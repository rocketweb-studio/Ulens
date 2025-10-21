'use client'

import s from './Sidebar.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { FlexContainer } from '@/src/shared/ui'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
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
  Sidebar,
} from '@rocketweb-studio/ulens-ui-kit'
import { Suspense, useState } from 'react'
import { Logout } from '@/src/features/auth/logout/ui/Logout'

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
        pathname === Path.UserProfile(data?.id) && params?.get('action') === 'create' ?
          IconPlusSquare
        : IconPlusSquareOutline,
      title: 'Create',
      href: Path.UserCreate(data?.id),
      isActive: pathname === Path.UserProfile(data?.id) && params?.get('action') === 'create',
    },
    {
      icon: pathname === Path.UserProfile(data?.id) && params?.size === 0 ? IconPerson : IconPersonOutline,
      title: 'My Profile',
      href: Path.UserProfile(data?.id),
      isActive: pathname === Path.UserProfile(data?.id) && params?.size === 0,
    },
    { icon: IconMessageCircleOutline, title: 'Messenger', href: Path.InDevelopment, isActive: false },
    { icon: IconSearch, title: 'Search', href: Path.InDevelopment, isActive: false },
    { icon: IconTrendingUpOutline, title: 'Statistics', href: Path.InDevelopment, isActive: false },
    { icon: IconBookmarkOutline, title: 'Favorites', href: Path.InDevelopment, isActive: false },
  ]

  return (

    <div className={s.container}>
      <div className={s.sidebarWrapper}>

        <Sidebar sidebarLinks={sidebarLinks} LinkComponent={Link}/>

        <FlexContainer className={s.linkWrapper} gap={'13px'}>
          <button onClick={() => setIsModalOpen(true)} className={s.logoutBtn}>
            <IconLogOutOutline className={s.icon}/>
            Log Out
          </button>
        </FlexContainer>
        {isModalOpen && <Logout isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={data?.email ?? ''}/>}
      </div>
    </div>
  )
}

export const SidebarWidget = () => {
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
