'use client'

import s from './AppLoader.module.scss'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectLoaderStatus } from '@/src/store/app-slice'

type Props = {
  forceMode?: boolean
  bg?: string | 'unset'
}

export const AppLoader = ({forceMode = false, bg}: Props) => {
  const loaderStatus = useAppSelector(selectLoaderStatus)
  if (loaderStatus !== 'loading' && !forceMode) return null

  return (
    <div className={s.appLoader} id='ct-loadding' style={{backgroundColor: bg || ''}}>
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
    </div>
  )
}
