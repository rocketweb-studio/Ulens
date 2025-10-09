import { ViewPostModal } from '@/src/widgets/ViewPostModal/ui/ViewPostModal'
import { ProfileHeader } from '@/src/widgets/profileHeader'
import { ProfilePosts } from '@/src/widgets/profilePosts'

export default async function FullPostPage({ params }: { params: Promise<{ userId: string; postId: string }> }) {
  const { userId, postId } = await params

  const [userData, postsData, postData] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, { next: { revalidate: 60 } }).then((res) =>
      res.json(),
    ),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, { next: { revalidate: 60 } }).then((res) =>
      res.json(),
    ),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${postId}`, { next: { revalidate: 60 } }).then((res) => res.json()),
  ])
  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={userData} />
      <ProfilePosts userId={userId} dataPosts={postsData} />
      <ViewPostModal dataPostModal={postData} hardLoad={true} />
    </>
  )
}
