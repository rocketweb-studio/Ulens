'use client'

import { useAppSelector } from "../../hooks/useAppSelector"
import s from "./AppLoader.module.scss"
import {selectLoaderStatus} from "@/src/app/app-slice";

export const AppLoader = () => {
  const loaderStatus = useAppSelector(selectLoaderStatus)
  if (loaderStatus !== 'loading') return null

  return (
      <div className={s.appLoader} id="ct-loadding">
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