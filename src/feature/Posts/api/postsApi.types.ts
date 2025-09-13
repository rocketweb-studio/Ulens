export type UploadPostImageResponse = {
  url: string,
  width: number,
  height: number,
  fileSize: number,
  createdAt: string,
  uploadId: string
}

export type GetPostsByUserIdResponse = {
  totalCount: number
  pageSize: number
  items: {
    id: string; // postId
    userName: string
    description: string
    location: {
      city: string | null
      country: string | null
      region: string | null
    };
    images: {
      url: string
      width: number
      height: number
      fileSize: number
      createdAt: string // ISO
      uploadId: string
    }[]
    createdAt: string // ISO
    updatedAt: string // ISO
    ownerId: string // userId
    avatarOwner: string | null // avatar url ('' если нет)
    owner: {
      firstName: string | null
      lastName: string | null
    };
    likeCount: number
    isLiked: boolean
    avatarWhoLikes: boolean
  }[]
  pageInfo: {
    endCursorPostId?: string
    hasNextPage: boolean
  };
};