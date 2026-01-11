//import { Area } from 'react-easy-crop'
//import { FilteredImage } from '@/src/features/post/postCreate/model/types'

export type UserRoom = {
  id: string
  userName: string
  firstName: string
  lastName: string
  avatar: string
}

export type MessageType = {
  id: number
  content: string
  media: MediaFields[] //| UploadVoiceResponce[]
  createdAt: string
  author: {
    id: string
    userName: string
    firstName: string
    lastName: string
    avatar: string
  }
}

export type MediaFields = {
  id: string
  messageId: string
  url: string
  width: number
  height: number
  fileSize: number
  size: string
  type: string
  duration: number
}

export type UploadedFileInMessage = {
  id: string
  file: string
  originalPreview: string
  preview: string
  width: string | number
  height: string | number
  zoom?: number
}

export type UploadImageResponse = {
  files: MediaFields[]
}

export type LastMessage = {
  id: number
  content: string
  createdAt: string
  authorId: string
  media: MediaFields //| UploadVoiceResponce
}

export type GetRoomsResponce = {
  id: number
  roomUser: UserRoom
  lastMessage: LastMessage
}[]

export type CreateRoomResponce = {
  id: number
}

export type GetMessagesByRoomResponce = MessageType[]

export type UploadVoiceRequest = {
  roomId: number
  audio: File;
}
export type UploadVoiceResponce = {
  id: string;
  messageId:number;
  url: string;
  type: 'AUDIO';
}
