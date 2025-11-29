export type UserRoom = {
  id: number
  userName: string
  firstName: string
  lastName: string
  avatar: string
}

export type Message = {
  id: number
  content: string
  cratedAt: string
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
  lastMessage: Message
}
