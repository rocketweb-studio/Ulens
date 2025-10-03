import ViewPostModal from '@/src/shared/components/ViewPostModal/ViewPostModal'
import {PostCreate} from '@/src/feature/postCreate/ui/PostCreate/PostCreate'
import {GetPostByIdResponse, GetPostsByUserIdResponse} from "@/src/feature/Posts/api/postsApi.types";
import {ProfileHeader} from "@/src/feature/userProfile/ui/ProfileHeader/ProfileHeader";
import {ProfilePosts} from "@/src/feature/userProfile/ui/ProfilePosts/ProfilePosts";
import {GetProfileByUserIdResponse} from "@/src/feature/userProfile/api/userProfile.types";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { userId } = await params
  const filters = await searchParams

  let dataPostModal: GetPostByIdResponse | undefined = undefined;

  const responseUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`)
  const dataUserInfo = await responseUserInfo.json() as GetProfileByUserIdResponse;

  const responsePosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`)
  const dataPosts = await responsePosts.json() as GetPostsByUserIdResponse;

  if (filters.postId) {
      try {
        const responsePost = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${filters.postId}`)
        if (responsePosts.ok) {
          dataPostModal = await responsePost.json() as GetPostByIdResponse;
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      }
  }

  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={dataUserInfo}/>
      <ProfilePosts userId={userId} dataPosts={dataPosts}/>
      {filters.postId && <ViewPostModal userId={userId} postId={filters.postId} dataPostModal={dataPostModal} dataUserInfo={dataUserInfo} />}
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
