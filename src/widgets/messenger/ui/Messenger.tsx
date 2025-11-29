'use client'

import { FlexContainer } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import { useGetRoomsQuery } from '@/src/entities/messenger'
import { useSearchParams } from 'next/navigation'

export const Messenger = () => {
  const { data: RoomsList } = useGetRoomsQuery()
  const params = useSearchParams()
  const activeChat = params.get('activeChat')
  console.log(RoomsList)
  console.log(params.get('activeChat'))
  return (
    <FlexContainer>
      <div className={s.messenger}>
        <div className={s.search}></div>
        <div className={s.header}></div>
        <div className={s.previewList}>
          <PreviewList />
        </div>
        <div className={s.chatView}></div>
        <div className={s.sendMessage}></div>
      </div>
    </FlexContainer>
  )
}
