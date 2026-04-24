import Image from 'next/image'
import s from './LikesInfo.module.scss'

type AvatarWhoLikes = {
  userId: string
  avatars?: {
    small?: {
      url?: string
    }
  }
}

type Props = {
  likeCount: number
  avatarWhoLikes: AvatarWhoLikes[]
}

export const LikesInfo = ({ likeCount, avatarWhoLikes }: Props) => {
  return (
    <div className={s.likesPostContainer}>
      <div className={s.likeImagesContainer}>
        {avatarWhoLikes.slice(0, 3).map((user) => (
          <Image
            key={user.userId}
            className={s.likeImage}
            width={24}
            height={24}
            src={
              user?.avatars?.small?.url ?
                `${process.env.NEXT_PUBLIC_MEDIA_URL}${user.avatars.small.url}`
              : '/github-svg.svg'
            }
            alt=''
          />
        ))}
      </div>

      <span>
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </span>
    </div>
  )
}
