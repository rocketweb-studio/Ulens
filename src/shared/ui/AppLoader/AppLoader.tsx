'use client'

import s from './AppLoader.module.scss'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectLoaderStatus } from '@/src/store/app-slice'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  forceMode?: boolean
  bg?: string | 'unset'
}

export const AppLoader = ({ forceMode = false, bg = '' }: Props) => {
  const loaderStatus = useAppSelector(selectLoaderStatus)
  if (loaderStatus !== 'loading' && !forceMode) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={s.appLoader}
        id='ct-loadding'
        style={{ backgroundColor: bg, zIndex: forceMode ? 99 : 999999 }}
      >
        <div className={s.loadingInfinity}>
          <div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
          <div>
            <span></span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
