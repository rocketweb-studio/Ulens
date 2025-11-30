import { useCallback } from 'react'
import { io } from 'socket.io-client'
import { ChatEvent } from '@/src/entities/messenger/model/consts'
import { Message } from '@/src/entities/messenger/api/messengerApi.type'

export const useWebSocketMessenger = () => {
  const sendMessage = useCallback((body: { roomId: number; content: string }) => {
    const token = localStorage.getItem('accessToken')
    const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    })

    return new Promise<Message>((resolve, reject) => {
      socket.emit(ChatEvent.SendMessage, body, (message: Message) => {
        socket.disconnect()
        resolve(message)
      })

      socket.on('error', (error) => {
        socket.disconnect()
        reject(error)
      })
    })
  }, [])

  return { sendMessage }
}
