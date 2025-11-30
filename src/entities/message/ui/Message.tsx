import s from './message.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'

type Props = {
  type: 'mine' | 'friend'
  message: string
  date: string
  avatar: string
  friendName: string
}

export const Message = ({ type, message, date, avatar, friendName }: Props) => {
  return (
    <div className={`${s.message} ${friendName === 'mine' ? s.mine : ''}`}>
      {type === 'friend' && (
        <UserAvatar mode={'size'} width={36} height={36} avatarOwner={avatar} userName={friendName} />
      )}
      <div className={s.messageContent}>
        <span className={s.messageContentText}>{message}</span>
        <span className={s.messageContentDate}>{date}</span>
      </div>
    </div>
  )
}
