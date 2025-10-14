import Image from 'next/image'
import s from './UserAvatar.module.scss'

type Props = {
  width?: number
  height?: number
  avatarOwner?: string | undefined
  userName: string
  mode: 'fill' | 'size'
}
export const UserAvatar = ({ userName, mode, avatarOwner, height = 0, width = 0 }: Props) => {
  const viewMode = mode === 'fill' ? { fill: true, style: { objectFit: 'cover' as const } } : { height, width }
  return (
    <>
      {avatarOwner ?
        <Image
          className={s.avatarImage}
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${avatarOwner}`}
          alt={'avatar'}
          {...viewMode}
        />
      : <div className={s.avatarText} style={{ height, width }}>
          {userName.slice(0, 2).toUpperCase()}
        </div>
      }
    </>
  )
}
