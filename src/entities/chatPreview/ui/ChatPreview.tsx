import s from './chatPreview.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'

type Props = {
  name: string
  message: string
  date: string
  userId: string
  isActive: boolean
  chatId: number
  changeActiveChat: (id: number, userId: string) => void
  avatar: string
}

export const ChatPreview = ({ name, message, date, userId, isActive, chatId, changeActiveChat, avatar }: Props) => {
  return (
    <div className={`${s.chatPreview} ${isActive ? s.active : ''}`} onClick={() => changeActiveChat(chatId, userId)}>
      <div className={s.avatar}>
        <UserAvatar userName={name} mode={'size'} width={48} height={48} avatarOwner={avatar} />
      </div>
      <div className={s.name}>{name}</div>
      <div className={s.date}>{date}</div>
      <div className={s.message}>{message}</div>
    </div>
  )
}
