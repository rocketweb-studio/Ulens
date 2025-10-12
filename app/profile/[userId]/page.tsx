import { ProfileHeader } from '@/src/widgets/profileHeader/ui/ProfileHeader'
import { ProfilePosts } from '@/src/widgets/profilePosts/ui/ProfilePosts'
import { GetProfileByUserIdResponse } from '@/src/entities/userProfile/api/userProfile.types'
import { GetPostsByUserIdResponse } from '@/src/entities/post/api/postsApi.types'
import { PostCreate } from '@/src/features/post/postCreate/ui/PostCreate/PostCreate'

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [_key: string]: string | undefined }>
}

let userData: GetProfileByUserIdResponse | undefined = undefined
let postsData: GetPostsByUserIdResponse | undefined = undefined

export default async function UserPage({ params, searchParams }: Props) {
  const [{ userId }, filters] = await Promise.all([params, searchParams])

  if (filters.action !== 'create') {
    userData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json())

    postsData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
      next: { revalidate: 30 },
    }).then((res) => res.json())
  }

  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={userData} />
      <ProfilePosts userId={userId} dataPosts={postsData} />
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
