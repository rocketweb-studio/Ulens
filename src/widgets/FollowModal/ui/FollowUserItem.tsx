import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { UserAvatar } from '@/src/entities/userProfile'
import s from './FollowUserItem.module.scss'

type Props = {
  user: {
    id: string
    userName: string
    firstName: string
    lastName: string
  }
  avatar: string | null
  isFollowing: boolean
  onFollow: () => void
  onUnfollow: () => void
  onClose: () => void
}

export const FollowUserItem = ({ user, avatar, isFollowing, onFollow, onUnfollow, onClose }: Props) => {
  return (
    <div className={s.item}>
      <div className={s.avatar}>
        <Link href={Path.UserProfile(user.id)} onClick={onClose}>
          <UserAvatar mode='size' userName={user.userName} width={50} height={50} avatarOwner={avatar} />
        </Link>
      </div>

      <Link href={Path.UserProfile(user.id)} className={s.info} onClick={onClose}>
        <span className={s.userName}>{user.userName}</span>
        <span className={s.fullName}>
          {user.firstName} {user.lastName}
        </span>
      </Link>

      {isFollowing ?
        <button className={s.unfollow} onClick={onUnfollow}>
          Unfollow
        </button>
      : <button className={s.follow} onClick={onFollow}>
          Follow
        </button>
      }
    </div>
  )
}
