export type UploadPostImageResponse = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
  uploadId: string
}

export type ImageSizeType = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
  uploadId: string
}

export type ImagesType = {
  small: ImageSizeType[]
  medium: ImageSizeType[]
}

export type GetPostsByUserIdResponse = {
  totalCount: number
  pageSize: number
  items: GetPostByIdResponse[]
  pageInfo: {
    endCursorPostId?: string
    hasNextPage: boolean
  }
}

export type GetPostByIdResponse = {
  id: string // postId
  userName: string
  description: string
  location: {
    city: string | null
    country: string | null
    region: string | null
  }
  images: ImagesType
  createdAt: string // ISO
  updatedAt: string // ISO
  ownerId: string // userId
  avatarOwner: string | null // avatar url ('' если нет)
  owner: {
    firstName: string | null
    lastName: string | null
  }
  likeCount: number
  isLiked: boolean
  avatarWhoLikes: {
    avatars: {
      small: ImageSizeType
      medium: ImageSizeType
    }
    userId: string
  }[]
}

export type GetPostCommentsType = {
  id: string
  postId: string
  content: string
  createdAt: string
  commentator: {
    id: string
    username: string
    avatar: string
  }
  likeCount: number
  isLiked: boolean
}[]
