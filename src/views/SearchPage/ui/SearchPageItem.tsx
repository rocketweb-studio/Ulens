import React from 'react'
import s from '@/src/views/SearchPage/ui/SearchPage.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { UserAvatar } from '@/src/entities/userProfile'
import { UserProfileType } from '@/src/entities/user/api/user.types'

type Props = {
  item: UserProfileType
}

export const SearchPageItem = ({ item }: Props) => {
  return (
    <div className={s.recentItem}>
      <div className={s.avatar}>
        <Link href={Path.UserProfile(item.id)}>
          <UserAvatar mode={'size'} userName={item.userName} width={50} height={50} avatarOwner={item.avatar} />
        </Link>
      </div>
      <div className={s.userInfo}>
        <div className={s.userName}>
          <Link href={Path.UserProfile(item.id)}>{item.userName}</Link>
        </div>
        <div className={s.firstName}>
          {item.firstName} {item.lastName}
        </div>
      </div>
    </div>
  )
}
