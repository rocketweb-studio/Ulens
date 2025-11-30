'use client'

import { FlexContainer, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import { useCreateRoomMutation, useGetMessagesByRoomIdQuery, useGetRoomsQuery } from '@/src/entities/messenger'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LastMessage, UserRoom } from '@/src/entities/messenger/api/messengerApi.type'
import { UserAvatar } from '@/src/entities/userProfile'
import { SendMessage } from '@/src/features/messenger/sentMessage'
import { Message } from '@/src/entities/message'

export const Messenger = () => {
  const { data: RoomsList, isSuccess: isGetRoomsSuccess, isLoading: isGetRoomsSuccessLoading } = useGetRoomsQuery()
  const params = useSearchParams()
  const activeChatParams = params.get('activeChat')
  const [createRoom] = useCreateRoomMutation()
  const hasCreatedRoom = useRef(false)
  const [activeChat, setActiveChat] = useState<{
    id: number
    roomUser: UserRoom
    lastMessage: LastMessage
  }>()
  const { data: RoomMessages } = useGetMessagesByRoomIdQuery({ roomId: activeChat?.id || 0 })

  const initActiveChat = () => {
    if (RoomsList) {
      const activeChatFromParams = RoomsList.find((item) => item.roomUser.id === activeChatParams)
      if (activeChatFromParams) {
        setActiveChat(activeChatFromParams)
      }
    }
  }

  const createNewRoom = useCallback(
    async (targetUserId: string) => {
      debugger
      await createRoom({ targetUserId }).unwrap()
    },
    [createRoom],
  )
  useEffect(() => {
    initActiveChat()
  }, [RoomsList])

  useEffect(() => {
    if (!isGetRoomsSuccessLoading && !activeChat && activeChatParams && isGetRoomsSuccess && !hasCreatedRoom.current) {
      hasCreatedRoom.current = true
      createNewRoom(activeChatParams)
    }
  }, [])

  return (
    <FlexContainer className={s.wrapper}>
      <div className={s.messenger}>
        <div className={s.search}>
          <Input placeholder={'Input search'} />
        </div>
        <div className={s.header}>
          <UserAvatar
            userName={`${activeChat?.roomUser.firstName} ${activeChat?.roomUser.lastName}`}
            mode={'size'}
            width={48}
            height={48}
            avatarOwner={activeChat?.roomUser.avatar}
          />
          <span>{`${activeChat?.roomUser.firstName} ${activeChat?.roomUser.lastName}`}</span>
        </div>
        <div className={s.previewList}>
          <PreviewList
            data={
              RoomsList?.map((item) => ({
                name: `${item.roomUser.firstName} ${item.roomUser.lastName}`,
                userId: item.roomUser.id,
                message: item.lastMessage?.content || 'No message',
                date:
                  item.lastMessage ?
                    `${new Date(item.lastMessage.createdAt).getUTCHours()}:${new Date(item.lastMessage.createdAt).getMinutes()}`
                  : '',
                id: item.id,
                avatar: item.roomUser.avatar,
                isActive: activeChat?.id === item.id,
              })) || []
            }
            changeActiveChat={(id) => setActiveChat(RoomsList?.find((item) => item.id === id))}
          />
        </div>
        <div className={s.chatView}>
          {!activeChat && <div className={s.notActiveChatBlock}>Choose who you would like to talk to</div>}
          {activeChat &&
            RoomMessages?.map((item) => (
              <Message
                key={item.id}
                type={'mine'}
                message={item.content}
                date={item.createdAt}
                avatar={''}
                friendName={''}
              />
            ))}
        </div>
        <div className={s.sendMessage}>
          <SendMessage roomId={activeChat?.id || 0} />
        </div>
      </div>
    </FlexContainer>
  )
}
