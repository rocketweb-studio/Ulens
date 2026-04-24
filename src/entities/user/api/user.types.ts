export type getFollowItem = {
  id: string
  userName: string
  createdAt: string
  firstName: string
  lastName: string
  city: string
  country: string
  dateOfBirth: string
  aboutMe: string
}

export type getFollowResponse = {
  totalCount: number
  pageSize: number
  pageNumber: number
  items: getFollowItem[]
}

export type UserProfileType = {
  id: string
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  dateOfBirth: string
  aboutMe: string
  createdAt: string
  avatar: string
}

export type PageInfoType = {
  endCursorUserId: string
  hasNextPage: boolean
}

export type PaginatedUsersType = {
  totalCount: number
  pageSize: number
  items: UserProfileType[]
  pageInfo: PageInfoType
}
