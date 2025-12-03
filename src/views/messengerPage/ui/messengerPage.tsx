'use client'

import { MessengerWidget } from '@/src/widgets/messenger'
import { FlexContainer } from '@rocketweb-studio/ulens-ui-kit'
import s from './messengerPage.module.scss'

export const MessengerPage = () => {
  return (
    <FlexContainer className={s.wrapper} wrap direction={'column'}>
      <h2 className={s.title}>Messenger</h2>
      <MessengerWidget />
    </FlexContainer>
  )
}
