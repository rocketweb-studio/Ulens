'use client'

import s from './GeneralInformation.module.scss'
import { UserAvatarUploader } from '@/src/entities/userProfile'
import { UpProfileInfo } from '@/src/entities/userProfile/ui/UpProfileInfo/UpProfileInfo'


export const GeneralInformation = () => {
  return (
    <div className={s.general}>
      <UserAvatarUploader/>
      <UpProfileInfo />
    </div>
  )
}
