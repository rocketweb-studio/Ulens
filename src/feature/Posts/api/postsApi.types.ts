export type UploadPostImageResponse = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
  uploadId: string
}

export type ImageSizeType = {
  url: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: string;
  uploadId: string;
};

export type ImagesType = {
  small: ImageSizeType[];
  medium: ImageSizeType[];
};

export type GetPostsByUserIdResponse = {
  totalCount: number
  pageSize: number
  items: {
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
    avatarWhoLikes: boolean
  }[]
  pageInfo: {
    endCursorPostId?: string
    hasNextPage: boolean
  }
}

export type GetPostByIdResponse = {
  id: string,
  userName: string,
  description: string,
  location: {
    city: string,
    country: string,
    region: string
  },
  images: ImagesType,
  createdAt: string,
  updatedAt: string,
  ownerId: string,
  avatarOwner: string,
  owner: {
    firstName: string,
    lastName: string
  },
  likeCount: number,
  isLiked: boolean,
  avatarWhoLikes: boolean
}
