import Image from 'next/image'
import s from './UserAvatar.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'

type Props = {
  width: number
  height: number
  avatarOwner: string | null
  userName: string
  userId: string
}
export const UserAvatar = ({ userName, userId, avatarOwner, height, width }: Props) => {
  return (
    <Link href={Path.UserProfile(userId)}>
      {avatarOwner ?
        <Image
          className={s.avatarImage}
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${avatarOwner}`}
          alt={'avatar'}
          height={height}
          width={width}
        ></Image>
      : <div className={s.avatarText} style={{ height, width }}>
          {userName.slice(0, 2).toUpperCase()}
        </div>
      }
    </Link>
  )
}
