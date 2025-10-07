'use client'

import Link from 'next/link'
import s from './Tabs.module.scss'
import { FlexContainer } from '@/src/shared/ui'
import { useSearchParams } from 'next/navigation'
import { getTabsSettings } from '@/src/shared/utils/getTabsSettings'

export const Tabs = () => {
  const params = useSearchParams()

  const tabsName = getTabsSettings(params!)

  return (
    <FlexContainer wrap justify={'center'}>
      {tabsName.map(({ title, href, isActive }, index) => (
        <Link className={`${s.link} ${isActive ? s.activeLink : ''}`} href={href} key={index}>
          {title}
        </Link>
      ))}
    </FlexContainer>
  )
}
