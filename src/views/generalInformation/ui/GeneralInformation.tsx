'use client'

import s from './GeneralInformation.module.scss'

import { useGetProfileByUsedIdQuery } from '@/src/entities/userProfile/api/userProfileApi'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { UserAvatarUploader } from '@/src/entities/userProfile'
import {UpProfileInfo} from "@/src/entities/userProfile/ui/UpProfileInfo/UpProfileInfo";



export const GeneralInformation = () => {
  const { data: meData } = useGetMeQuery()
  const { data: dataProfile } = useGetProfileByUsedIdQuery({ userId: meData?.id! }, { skip: !meData?.id })

  return (
    <div className={s.general}>
      {dataProfile && <UserAvatarUploader avatars={dataProfile.avatars} />}
      <UpProfileInfo dataProfile={dataProfile}/>
    </div>
  )
}
