'use client'

import { Button, FlexContainer, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import { useCreateRoomMutation, useGetRoomsQuery } from '@/src/entities/messenger'
import { useSearchParams } from 'next/navigation'

export const Messenger = () => {
  const { data: RoomsList, isSuccess: isGetRoomsSuccess } = useGetRoomsQuery()
  const params = useSearchParams()
  const activeChatParams = params.get('activeChat')
  const [createRoom, { data: createRoomData, isUninitialized }] = useCreateRoomMutation()

  const activeChat = RoomsList?.find((item) => item.roomUser.id === activeChatParams)

  const createNewRoom = async (targetUserId: string) => {
    await createRoom({ targetUserId }).unwrap()
  }

  if (!activeChat && activeChatParams && isGetRoomsSuccess && !createRoomData && isUninitialized) {
    createNewRoom(activeChatParams)
  }

  return (
    <FlexContainer className={s.wrapper}>
      <div className={s.messenger}>
        <div className={s.search}>
          <Input placeholder={'Input search'} />
        </div>
        <div className={s.header}>Header</div>
        <div className={s.previewList}>
          <PreviewList />
        </div>
        <div className={s.chatView}>Chat</div>
        <div className={s.sendMessage}>
          <Button variant={'text'}>Send message</Button>
        </div>
      </div>
    </FlexContainer>
  )
}
