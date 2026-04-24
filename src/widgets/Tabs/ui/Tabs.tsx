'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FlexContainer } from '@/src/shared/ui'
import { getTabsSettings } from '@/src/shared/utils/getTabsSettings'
import s from './Tabs.module.scss'

export const Tabs = () => {
  const params = useSearchParams()
  const tabsName = getTabsSettings(params!)

  return (
    <FlexContainer wrap justify={'center'}>
      {tabsName.map(({ title, href, isActive }, index) => (
        <Link
          href={href}
          key={index}
          className={`${s.link} ${isActive ? s.activeLink : ''}`}
        >
          {title}
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className={s.activeIndicator}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </Link>
      ))}
    </FlexContainer>
  )
}
