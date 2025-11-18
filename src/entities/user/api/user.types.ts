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
