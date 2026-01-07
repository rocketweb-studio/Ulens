import s from './message.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { MediaFields, MessageType, UploadVoiceResponce } from '@/src/entities/messenger/api/messengerApi.type'
import Image from 'next/image'
import { AudioMessage } from '@/src/entities/message/ui/voiceMessage/AudioMessage'

type Props = {
  type: 'mine' | 'friend'
  message: string
  media: MediaFields[] | UploadVoiceResponce
  date: string
  avatar: string
  friendName: string
}

export const Message = ({ type, message, media, date, avatar, friendName }: Props) => {

  const mediaDataMessage=Array.isArray(media) && media.length
    ? media.filter((item) => item.type === 'IMAGE' && item.size === 'medium')
    :media;

  if(!Array.isArray(media)){
    console.log(media)
  }

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

        {/*Аудио или Изображения */}
        {Array.isArray(mediaDataMessage) && mediaDataMessage.length > 0 ? (
          <div className={`${s.telegramGrid} ${message && s.hasMessage}`}>
            {mediaDataMessage?.map((img) => (
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
        ) :  (mediaDataMessage as UploadVoiceResponce)?.url &&(
          <div className={s.audioContainer}>
            <AudioMessage
              audioUrl={getMediaUrl((mediaDataMessage as UploadVoiceResponce).url)}
              type={type}
            />
          </div>
        )}

        {/* Текст сообщения */}
        {message && <div className={s.messageContentText}>{message}</div>}

        {/* Дата */}
        <div className={`${s.messageContentDate} ${(!message ) && s.imageDate}`}>
          {date}
        </div>
      </div>
    </div>
  )
}
