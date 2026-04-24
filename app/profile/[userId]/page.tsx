import { ProfileHeader } from '@/src/widgets/profileHeader/ui/ProfileHeader'
import { ProfilePosts } from '@/src/widgets/profilePosts/ui/ProfilePosts'
import { PostCreate } from '@/src/features/post/postCreate/ui/PostCreate/PostCreate'

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [_key: string]: string | undefined }>
}

export default async function UserPage({ params, searchParams }: Props) {
  const [{ userId }, filters] = await Promise.all([params, searchParams])

  const userData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
    next: { revalidate: 60 },
  }).then((res) => res.json())

  const postsData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
    next: { revalidate: 31 },
  }).then((res) => res.json())

  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={userData} />
      <ProfilePosts userId={userId} dataPosts={postsData} />
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
