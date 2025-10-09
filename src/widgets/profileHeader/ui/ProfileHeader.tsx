'use client'

import Image from 'next/image'
import avatar from '@/public/assets/avatarTmp/avatar.jpg'
import { useGetProfileByUsedIdQuery } from '@/src/entities/userProfile/api/userProfileApi'
import { Button } from '@/src/shared/ui'
import { FlexContainer } from '@/src/shared/ui'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { GetProfileByUserIdResponse } from '@/src/entities/userProfile/api/userProfile.types'
import s from './profileHeader.module.scss'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { setLoaderStatus } from '@/src/store/app-slice'
import { useEffect } from 'react'
import { AppLoader } from '@/src/shared/ui/AppLoader/AppLoader'

type Props = {
  userId: string
  dataUserInfo?: GetProfileByUserIdResponse
}

export const ProfileHeader = ({ userId, dataUserInfo }: Props) => {
  const { data: meData, isSuccess } = useGetMeQuery()
  const { data: userData } = useGetProfileByUsedIdQuery({ userId })
  const isAuth = !!meData?.id && isSuccess
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (document.readyState === 'complete') {
      dispatch(setLoaderStatus({ status: 'idle' }))
    }
  }, [])

  const userDataForRender = userData || dataUserInfo

  const handleFollow = () => {
    console.log('handleFollow')
  }

  const handleSendMessage = () => {
    console.log('handleSendMessage')
  }

  return (
    <div className={s.profileHeader}>
      <div className={s.profileAvatar}>
        {userDataForRender && userDataForRender?.avatars?.length > 0 ?
          <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${userDataForRender?.avatars[0].url}`} alt={'avatar'} />
        : <Image src={avatar} alt={'avatar'} />}
      </div>
      <div className={s.profileInfo}>
        <div className={s.nameAndFollowRow}>
          <h1>{userDataForRender?.userName}</h1>
          {isAuth && userDataForRender?.id === meData?.id ?
            <Link href={Path.Settings('info')}>
              <Button size={'medium'} variant={'secondary'} onClick={handleFollow}>
                Profile Settings
              </Button>
            </Link>
          : <FlexContainer gap={'15px'}>
              <Button size={'medium'} variant={'primary'} onClick={handleFollow}>
                Follow
              </Button>
              <Button size={'medium'} variant={'secondary'} onClick={handleSendMessage}>
                Send Message
              </Button>
            </FlexContainer>
          }
        </div>
        <div className={s.statisticRow}>
          <div className={s.statisticItem}>
            <strong>{userDataForRender?.following}</strong>
            <span>Following</span>
          </div>
          <div className={s.statisticItem}>
            <strong>{userDataForRender?.followers}</strong>
            <span>Followers</span>
          </div>
          <div className={s.statisticItem}>
            <strong>{userDataForRender?.publicationsCount}</strong>
            <span>Publications</span>
          </div>
        </div>
        <div className={s.aboutUser}>
          {userDataForRender?.aboutMe ?
            userDataForRender.aboutMe
          : <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolor ex hic iusto nulla optio sed
              totam voluptatem? Adipisci aliquid amet corporis deleniti earum eligendi error ipsum iste labore nobis,
              perferendis quas quasi rem soluta suscipit veniam vero voluptatem voluptatum? Accusamus aliquam architecto
              facilis ipsa, maxime non quasi quis sit.
            </span>
          }
        </div>
      </div>
    </div>
  )
}
