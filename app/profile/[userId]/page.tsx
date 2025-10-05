import ViewPostModal from '@/src/shared/components/ViewPostModal/ViewPostModal'
import { ProfileHeader } from '@/src/features/userProfile/ui/ProfileHeader/ProfileHeader'
import { ProfilePosts } from '@/src/features/userProfile/ui/ProfilePosts/ProfilePosts'
import { GetProfileByUserIdResponse } from '@/src/features/userProfile/api/userProfile.types'
import { GetPostByIdResponse, GetPostsByUserIdResponse } from '@/src/entities/post/api/postsApi.types'
import { PostCreate } from '@/src/features/post/postCreate/ui/PostCreate/PostCreate'

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [_key: string]: string | undefined }>
}) {
  const { userId } = await params
  const filters = await searchParams

  let dataPostModal: GetPostByIdResponse | undefined = undefined
  let dataUserInfo: GetProfileByUserIdResponse | undefined = undefined
  let dataPosts: GetPostsByUserIdResponse | undefined = undefined

  if (filters.action !== 'create') {
    // const [userInfoResponse, postsResponse] = await Promise.all([
    //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
    //     next: { revalidate: 60 } // Кэшируем на 60 секунд
    //   }),
    //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
    //     next: { revalidate: 30 } // Кэшируем на 30 секунд
    //   })
    // ])
    //
    // const [dataUserInfo, dataPosts] = await Promise.all([
    //   userInfoResponse.json(),
    //   postsResponse.json()
    // ])

    const responseUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
      next: { revalidate: 60 },
    })
    dataUserInfo = (await responseUserInfo.json()) as GetProfileByUserIdResponse

    const responsePosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
      next: { revalidate: 30 },
    })
    dataPosts = (await responsePosts.json()) as GetPostsByUserIdResponse

    if (filters.postId) {
      const responsePost = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${filters.postId}`, {
        next: { revalidate: 60 },
      })
      dataPostModal = (await responsePost.json()) as GetPostByIdResponse
    }
  }
  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={dataUserInfo} />
      <ProfilePosts userId={userId} dataPosts={dataPosts} />
      {filters.postId && (
        <ViewPostModal
          userId={userId}
          postId={filters.postId}
          dataPostModal={dataPostModal}
          dataUserInfo={dataUserInfo}
        />
      )}
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
