'use client'

import { FlexContainer, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './messenger.module.scss'
import { PreviewList } from '@/src/widgets/messenger/ui/PreviewList/PreviewList'
import {
  MessageType,
  messengerApi,
  useCreateRoomMutation,
  useGetMessagesByRoomIdQuery,
  useGetRoomsQuery,
} from '@/src/entities/messenger'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LastMessage, UserRoom } from '@/src/entities/messenger/api/messengerApi.type'
import { UserAvatar } from '@/src/entities/userProfile'
import { SendMessage } from '@/src/features/messenger/sentMessage'
import { Message } from '@/src/entities/message'
import { io } from 'socket.io-client'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { dateFormatterForChat } from '@/src/shared/utils'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'

export const Messenger = () => {
  const {
    data: RoomsList,
    isSuccess: isGetRoomsSuccess,
    isLoading: isGetRoomsLoading,
    refetch: refetchRoomList,
  } = useGetRoomsQuery()
  const router = useRouter()
  const pathname = usePathname()
  const { data: meData } = useGetMeQuery()
  const params = useSearchParams()
  const dispatch = useAppDispatch()
  const activeChatParams = params.get('activeChat')
  const [createRoom] = useCreateRoomMutation()
  const hasCreatedRoom = useRef(false)
  const [activeChat, setActiveChat] = useState<{
    id: number | null
    roomUser: UserRoom
    lastMessage: LastMessage
  } | null>({ id: null, roomUser: {} as UserRoom, lastMessage: {} as LastMessage })
  const {
    data: RoomMessages,
    isLoading: isLoadingRoomMessages,
    isFetching: isFetchingRoomMessages,
  } = useGetMessagesByRoomIdQuery({
    roomId: activeChat?.id || 0,
  })

  const initActiveChat = () => {
    if (RoomsList) {
      const activeChatFromParams = RoomsList.find((item) => item.roomUser.id === activeChatParams)
      activeChatFromParams ? setActiveChat(activeChatFromParams) : setActiveChat(null)
    }
  }

  const createNewRoom = useCallback(
    async (targetUserId: string) => {
      await createRoom({ targetUserId }).unwrap()
    },
    [createRoom],
  )

  const checkAuthorMessage = (message: MessageType): 'mine' | 'friend' => {
    if (message?.author.id === meData?.id) {
      return 'mine'
    } else {
      return 'friend'
    }
  }

  useEffect(() => {
    initActiveChat()
  }, [RoomsList])

  useEffect(() => {
    if (
      !isGetRoomsLoading &&
      activeChat?.id === null &&
      activeChatParams &&
      isGetRoomsSuccess &&
      !hasCreatedRoom.current
    ) {
      hasCreatedRoom.current = true
      if (!RoomsList.find((item) => item.roomUser.id === activeChatParams)) {
        createNewRoom(activeChatParams)
      }
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!activeChat) return
    const socket = io('https://ulens.org/ws', { auth: { token } })

    socket.on('connect', () => {
      socket.emit('SUBSCRIBE_CHAT', { roomId: activeChat?.id })
      socket.emit('SUBSCRIBE_ALL_ROOM_MESSAGES', { userId: meData?.id })
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

    socket.on('NEW_GLOBAL_MESSAGE', () => {
      refetchRoomList()
    })

    return () => {
      socket.disconnect()
    }
  }, [activeChat])

  return (
    <FlexContainer className={s.wrapper}>
      <div className={s.messenger}>
        <div className={s.search}>
          <Input placeholder={'Input search'} />
        </div>
        <div className={s.header}>
          {activeChat !== null && (
            <>
              <UserAvatar
                userName={`${activeChat?.roomUser.firstName} ${activeChat?.roomUser.lastName}`}
                mode={'size'}
                width={48}
                height={48}
                avatarOwner={activeChat?.roomUser.avatar}
              />
              <span>{`${activeChat?.roomUser.firstName} ${activeChat?.roomUser.lastName}`}</span>
            </>
          )}
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
            changeActiveChat={(id, userId) => {
              router.push(`${pathname}?activeChat=${userId}`)
              setActiveChat((prevState) => RoomsList?.find((item) => item.id === id) || prevState)
            }}
          />
        </div>
        <div className={s.chatView}>
          {RoomMessages?.length === 0 && !isFetchingRoomMessages && !isLoadingRoomMessages && activeChat !== null && (
            <div className={s.notActiveChatBlock}>No messages</div>
          )}
          {activeChat === null && <div className={s.notActiveChatBlock}>Choose who you would like to talk to</div>}
          {isLoadingRoomMessages || (isFetchingRoomMessages && <div>Loading...</div>)}
          {activeChat &&
            !isLoadingRoomMessages &&
            !isFetchingRoomMessages &&
            RoomMessages &&
            RoomMessages?.map((item) => (
              <Message
                key={item.id}
                type={checkAuthorMessage(item)}
                message={item.content}
                date={dateFormatterForChat(item.createdAt)}
                avatar={''}
                friendName={`${item.author.firstName} ${item.author.lastName}`}
              />
            )).reverse()}
        </div>
        <div className={s.sendMessage}>
          <SendMessage roomId={activeChat?.id ? activeChat?.id : null} isDisable={activeChat === null} />
        </div>
      </div>
    </FlexContainer>
  )
}
