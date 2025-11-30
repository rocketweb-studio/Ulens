import { ChatPreview } from '@/src/entities/chatPreview'
import s from './previewList.module.scss'

type Props = {
  data: {
    name: string
    message: string
    date: string
    id: number
    userId: string
    isActive: boolean
    avatar: string
  }[]
  changeActiveChat: (id: number) => void
}

export const PreviewList = ({ data, changeActiveChat }: Props) => {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} className={s.previewListItem}>
          <ChatPreview
            name={item.name}
            message={item.message}
            date={item.date}
            userId={item.userId}
            isActive={item.isActive}
            chatId={item.id}
            changeActiveChat={changeActiveChat}
            avatar={item.avatar}
          />
        </li>
      ))}
    </ul>
  )
}
