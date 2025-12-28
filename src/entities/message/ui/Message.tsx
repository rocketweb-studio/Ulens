// @/src/entities/message/ui/Message/Message.tsx
import s from './message.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { MediaFields } from '@/src/entities/messenger/api/messengerApi.type'
import Image from 'next/image'
import { AudioMessage } from '@/src/entities/message/ui/voiceMessage/AudioMessage'

type Props = {
  type: 'mine' | 'friend'
  message: string
  media: MediaFields[]
  date: string
  avatar: string
  friendName: string
}

export const Message = ({ type, message, media, date, avatar, friendName }: Props) => {
  // Фильтруем изображения
  const images = media?.filter((item) => item.type === 'IMAGE' && item.size === 'medium')
  // console.log('🔍 Message component:',media?.filter(item => item.type === 'AUDIO'))
  // Фильтруем аудио
  const audioItems = media?.filter((item) => item.type === 'AUDIO')

  // Получаем полный URL для медиа
  const getMediaUrl = (url: string) => {
    return `${process.env.NEXT_PUBLIC_MEDIA_URL}${url}`
  }

  return (
    <div className={`${s.message} ${type === 'mine' ? s.mine : ''}`}>
      {type === 'friend' && (
        <UserAvatar
          mode={'size'}
          width={36}
          height={36}
          avatarOwner={avatar}
          userName={friendName}
        />
      )}
      <div className={s.messageContent}>
        {/* Аудио сообщения */}
        {audioItems?.map((audio) => (
          <div key={audio.id} className={s.audioContainer}>
            <AudioMessage
              audioUrl={getMediaUrl(audio.url)}
              duration={audio.duration}
              type={type}
            />
          </div>
        ))}

        {/* Изображения */}
        {images?.length > 0 && (
          <div className={`${s.telegramGrid} ${(message || audioItems?.length > 0) && s.hasMessage}`}>
            {images?.map((img) => (
              <div className={s.gridItem} key={img.id}>
                <Image
                  src={getMediaUrl(img.url)}
                  alt=""
                  width={img.width || 200}
                  height={img.height || 200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Текст сообщения */}
        {message && <div className={s.messageContentText}>{message}</div>}

        {/* Дата */}
        <div className={`${s.messageContentDate} ${(!message && images?.length === 0 && audioItems?.length === 0) && s.imageDate}`}>
          {date}
        </div>
      </div>
    </div>
  )
}
