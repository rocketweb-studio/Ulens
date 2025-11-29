import s from './chatPreview.module.scss'
import { FlexContainer } from '@rocketweb-studio/ulens-ui-kit'
import Image from 'next/image'

type Props = {
  name: string
  message: string
  date: string
  avatar: string
}

export const ChatPreview = ({ name, message, date, avatar }: Props) => {
  return (
    <div className={s.chatPreview}>
      <FlexContainer>
        <div className={s.avatar}>
          <Image src={avatar} alt={'avatar'} />
        </div>
        <div className={s.mainContent}>
          <div className={s.name}>{name}</div>
        </div>
        <div className={s.date}>{date}</div>
        <div className={s.message}>{message}</div>
      </FlexContainer>
    </div>
  )
}
