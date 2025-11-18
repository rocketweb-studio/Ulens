'use client'

import { useGetProfileByUsedIdQuery } from '@/src/entities/userProfile/api/userProfileApi'
import { Button, FlexContainer } from '@/src/shared/ui'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { GetProfileByUserIdResponse } from '@/src/entities/userProfile/api/userProfile.types'
import s from './profileHeader.module.scss'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { setLoaderStatus } from '@/src/store/app-slice'
import { useEffect } from 'react'
import { UserAvatar } from '@/src/entities/userProfile'
import { useFollowUserMutation, useGetFollowingsQuery, useUnfollowUserMutation } from '@/src/entities/user/api/userApi'

type Props = {
  userId: string
  dataUserInfo?: GetProfileByUserIdResponse
}

export const ProfileHeader = ({ userId, dataUserInfo }: Props) => {
  const { data: meData, isSuccess } = useGetMeQuery()
  const { data: followingsData } = useGetFollowingsQuery()
  const { data: userData } = useGetProfileByUsedIdQuery({ userId })

  const [follow] = useFollowUserMutation()
  const [unfollow] = useUnfollowUserMutation()

  const isAuth = !!meData?.id && isSuccess
  const dispatch = useAppDispatch()

  // отключаем лодер при полной загрузке профиля, после логина
  useEffect(() => {
    if (document.readyState === 'complete') {
      dispatch(setLoaderStatus({ status: 'idle' }))
    }
  }, [])

  const userDataForRender = userData || dataUserInfo

  const followStatus = followingsData?.items.find((user) => user.id === userId)

  const handleFollow = () => follow({ userId })
  const handleUnfollow = () => unfollow({ userId })
  const handleSendMessage = () => {}

  return (
    <div className={s.profileHeader}>
      <div className={s.profileAvatar}>
        <UserAvatar
          mode={'fill'}
          userName={userDataForRender?.userName!}
          avatarOwner={userDataForRender?.avatars?.medium?.url}
        />
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
              {followStatus ?
                <Button size={'medium'} variant={'outline'} onClick={handleUnfollow}>
                  Unfollow
                </Button>
              : <Button size={'medium'} variant={'primary'} onClick={handleFollow}>
                  Follow
                </Button>
              }
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
        <div className={s.aboutUser}>{userDataForRender?.aboutMe}</div>
      </div>
    </div>
  )
}
