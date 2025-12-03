'use client'

import { FlexContainer, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import {
  messengerApi,
  useCreateRoomMutation,
  useGetMessagesByRoomIdQuery,
  useGetRoomsQuery,
} from '@/src/entities/messenger'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LastMessage, UserRoom } from '@/src/entities/messenger/api/messengerApi.type'
import { UserAvatar } from '@/src/entities/userProfile'
import { SendMessage } from '@/src/features/messenger/sentMessage'
import { Message } from '@/src/entities/message'
import { io } from 'socket.io-client'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { dateFormatterForChat } from '@/src/shared/utils'

export const Messenger = () => {
  const { data: RoomsList, isSuccess: isGetRoomsSuccess, isLoading: isGetRoomsSuccessLoading } = useGetRoomsQuery()
  const params = useSearchParams()
  const dispatch = useAppDispatch()
  const activeChatParams = params.get('activeChat')
  const [createRoom] = useCreateRoomMutation()
  const hasCreatedRoom = useRef(false)
  const [activeChat, setActiveChat] = useState<{
    id: number | null
    roomUser: UserRoom
    lastMessage: LastMessage
  }>({ id: null, roomUser: {} as UserRoom, lastMessage: {} as LastMessage })
  const {
    data: RoomMessages,
    isLoading: isLoadingRoomMessages,
    isFetching: isFetchingRoomMessages,
  } = useGetMessagesByRoomIdQuery({
    roomId: activeChat?.id || 0,
  })
  const token = localStorage.getItem('accessToken')

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

  useEffect(() => {
    if (!activeChat) return
    const socket = io('https://ulens.org/ws', { auth: { token } })

    socket.on('connect', () => {
      socket.emit('SUBSCRIBE_CHAT', { roomId: activeChat?.id || 0 })
    })

    socket.on('NEW_MESSAGE', (msg) => {
      dispatch(
        messengerApi.util.updateQueryData(
          'getMessagesByRoomId',
          { roomId: activeChat.id !== null ? activeChat.id : 0 },
          (draft) => {
            draft.unshift(msg)
          },
        ),
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [activeChat, token])

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
                date: item.lastMessage ? dateFormatterForChat(item.lastMessage.createdAt) : '',
                id: item.id,
                avatar: item.roomUser.avatar,
                isActive: activeChat?.id === item.id,
              })) || []
            }
            changeActiveChat={(id) =>
              setActiveChat((prevState) => RoomsList?.find((item) => item.id === id) || prevState)
            }
          />
        </div>
        <div className={s.chatView}>
          {RoomMessages?.length === 0 && !isFetchingRoomMessages && !isLoadingRoomMessages && (
            <div className={s.notActiveChatBlock}>No messages</div>
          )}
          {!activeChat && <div className={s.notActiveChatBlock}>Choose who you would like to talk to</div>}
          {isLoadingRoomMessages || (isFetchingRoomMessages && <div>Loading...</div>)}
          {activeChat &&
            !isLoadingRoomMessages &&
            !isFetchingRoomMessages &&
            RoomMessages &&
            RoomMessages?.map((item) => (
              <Message
                key={item.id}
                type={'mine'}
                message={item.content}
                date={dateFormatterForChat(item.createdAt)}
                avatar={''}
                friendName={''}
              />
            )).reverse()}
        </div>
        <div className={s.sendMessage}>
          <SendMessage roomId={activeChat?.id} />
        </div>
      </div>
    </FlexContainer>
  )
}
