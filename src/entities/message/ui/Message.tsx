
import s from './message.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { MediaFields, MessageType, UploadVoiceResponce } from '@/src/entities/messenger/api/messengerApi.type'
import Image from 'next/image'
import { AudioMessage } from '@/src/entities/message/ui/voiceMessage/AudioMessage'

type Props = {
  type: 'mine' | 'friend'
  message: string
  media: MediaFields[] //| UploadVoiceResponce[]
  date: string
  avatar: string
  friendName: string
}

// Получаем полный URL для медиа
export const getMediaUrl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_MEDIA_URL}${url}`
}

export const Message = ({ type, message, media, date, avatar, friendName }: Props) => {

  const filterImage=Array.isArray(media) && media?.filter((item) => item.type === 'IMAGE' && item.size === 'medium')
  //@ts-ignore
   const audio=Array.isArray(media) && media[0]?.type === 'AUDIO' ? media[0] : typeof media==='object' && media?.type==='AUDIO'?media:false  //(media && media[0]?.type === 'AUDIO') && media[0]

  // console.log('Message mediaDataMessage: ',mediaDataMessage)
     console.log('Message media: ',media)
  //@ts-ignore
 // if(mediaDataMessage?.url){  console.log('Message mediaDataMessage.url: ',mediaDataMessage.url)}



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
        {filterImage && (
          <div className={`${s.telegramGrid} ${message && s.hasMessage}`}>
            {filterImage?.map((img) => (
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
        { audio &&(
          <div className={s.audioContainer}>
            <AudioMessage
              //@ts-ignore
              audioUrl={getMediaUrl(audio.url)}
                type={type}
            />
          </div>
        )}

        {/* Текст сообщения */}
        {message && <div className={s.messageContentText}>{message}</div>}

        {/* Дата */}
        <div className={`${s.messageContentDate} `}> {/* ${(!message ) && s.imageDate} */}
          {date}
        </div>
      </div>
    </div>
  )
}
