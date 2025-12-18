import s from './message.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { MediaFields } from '@/src/entities/messenger/api/messengerApi.type'
import Image from 'next/image'
import React from 'react'

type Props = {
  type: 'mine' | 'friend'
  message: string
  media: MediaFields[]
  date: string
  avatar: string
  friendName: string
}

export const Message = ({ type, message, media, date, avatar, friendName }: Props) => {
  const filterImage = media?.filter((item) => item.size === 'medium')

  return (
    <div className={`${s.message} ${type === 'mine' ? s.mine : ''}`}>
      {type === 'friend' && (
        <UserAvatar mode={'size'} width={36} height={36} avatarOwner={avatar} userName={friendName} />
      )}
      <div className={s.messageContent}>
        {filterImage?.length > 0 && (
          <span className={`${s.messageImages} ${message && s.hasMessage}`}>
            {filterImage?.map((img, index) => (
              <Image
                key={index}
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${img.url}`}
                alt={''}
                width={img.width}
                height={img.height}
              />
            ))}
          </span>
        )}
        {message && <span className={s.messageContentText}>{message}</span>}
        <span className={`${s.messageContentDate} ${!message && s.imageDate}`}>{date}</span>
      </div>
    </div>
  )
}
