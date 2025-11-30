export type UserRoom = {
  id: string
  userName: string
  firstName: string
  lastName: string
  avatar: string
}

export type Message = {
  id: number
  content: string
  createdAt: string
  author: {
    id: string
    userName: string
    firstName: string
    lastName: string
    avatar: string
  }
}

export type LastMessage = {
  id: number
  content: string
  createdAt: string
  authorId: string
  media: {
    id: string
    messageId: string
    url: string
    width: number
    height: number
    fileSize: number
    size: string
    type: string
  }
}

export type GetRoomsResponce = {
  id: number
  roomUser: UserRoom
  lastMessage: LastMessage
}[]

export type CreateRoomResponce = {
  id: number
}

export type GetMessagesByRoomResponce = Message[]
