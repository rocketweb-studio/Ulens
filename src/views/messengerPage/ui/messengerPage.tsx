'use client'

import { MessengerWidget } from '@/src/widgets/messenger'
import { FlexContainer } from '@rocketweb-studio/ulens-ui-kit'
import s from './messengerPage.module.scss'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'

export const MessengerPage = () => {
  const { isSuccess } = useGetMeQuery()

  if (!isSuccess) {
    return null
  }

  return (
    <FlexContainer className={s.wrapper} wrap direction={'column'}>
      <h2 className={s.title}>Messenger</h2>
      <MessengerWidget />
    </FlexContainer>
  )
}
