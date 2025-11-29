'use client'

import { Button, FlexContainer, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import { useCreateRoomMutation, useGetRoomsQuery } from '@/src/entities/messenger'
import { useSearchParams } from 'next/navigation'
import Scrollbars from 'react-custom-scrollbars'

export const Messenger = () => {
  const { data: RoomsList, isSuccess: isGetRoomsSuccess } = useGetRoomsQuery()
  const params = useSearchParams()
  const activeChatParams = params.get('activeChat')
  const [createRoom, { data }] = useCreateRoomMutation()

  console.log(RoomsList)
  const activeChat = RoomsList?.find((item) => item.roomUser.id === activeChatParams)

  const createNewRoom = async (targetUserId: string) => {
    await createRoom({ targetUserId }).unwrap()
    console.log('create room  ' + data)
  }

  if (!activeChat && activeChatParams && isGetRoomsSuccess) {
    console.log('нет активных чатов')
  }
  console.log('парамс ' + activeChatParams)

  return (
    <FlexContainer className={s.wrapper}>
      <div className={s.messenger}>
        <div className={s.search}>
          <Input placeholder={'Input search'} />
        </div>
        <div className={s.header}>Header</div>
        <div className={s.previewList}>
          <Scrollbars style={{ height: 340 }}>
            <PreviewList />
          </Scrollbars>
        </div>
        <div className={s.chatView}>Chat</div>
        <div className={s.sendMessage}>
          <Button variant={'text'}>Send message</Button>
        </div>
      </div>
    </FlexContainer>
  )
}
