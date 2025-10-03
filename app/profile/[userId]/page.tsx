import ViewPostModal from '@/src/shared/components/ViewPostModal/ViewPostModal'
import {PostCreate} from '@/src/feature/postCreate/ui/PostCreate/PostCreate'
import {GetProfileByUserIdResponse} from "@/src/feature/userProfile/api/userProfile.types";
import {GetPostsByUserIdResponse} from "@/src/feature/Posts/api/postsApi.types";
import {ProfileHeader} from "@/src/feature/userProfile/ui/UserProfile/ProfileHeader/ProfileHeader";
import {ProfilePosts} from "@/src/feature/userProfile/ui/UserProfile/ProfilePosts/ProfilePosts";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { userId } = await params
  const filters = await searchParams
  console.log(filters)
  if (filters.postId) {
    filters.action = ''
  }

  const responseUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`)
  const dataUserInfo = await responseUserInfo.json() as GetProfileByUserIdResponse;

  const responsePosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`)
  const dataPosts = await responsePosts.json() as GetPostsByUserIdResponse;

  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={dataUserInfo}/>
      <ProfilePosts userId={userId} dataPosts={dataPosts}/>
      {filters.postId && <ViewPostModal userId={userId} postId={filters.postId} />}
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
