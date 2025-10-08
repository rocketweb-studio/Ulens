import { ProfileHeader } from '@/src/widgets/profileHeader/ui/ProfileHeader'
import { ProfilePosts } from '@/src/widgets/profilePosts/ui/ProfilePosts'
import { GetProfileByUserIdResponse } from '@/src/entities/userProfile/api/userProfile.types'
import { GetPostByIdResponse, GetPostsByUserIdResponse } from '@/src/entities/post/api/postsApi.types'
import { PostCreate } from '@/src/features/post/postCreate/ui/PostCreate/PostCreate'
import { ViewPostModal } from '@/src/widgets/ViewPostModal'
import { Suspense } from 'react'
import { AppLoader } from '@/src/shared/ui/AppLoader/AppLoader'

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [_key: string]: string | undefined }>
}

export default async function UserPage({ params, searchParams }: Props) {
  const [{ userId }, filters] = await Promise.all([params, searchParams])

  // let dataPostModal: GetPostByIdResponse | undefined = undefined
  // let dataUserInfo: GetProfileByUserIdResponse | undefined = undefined
  // let dataPosts: GetPostsByUserIdResponse | undefined = undefined

  const [userData, postsData, modalData] = await Promise.all([
    // Основные данные профиля
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    // Посты пользователя
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
      next: { revalidate: 30 },
    }).then((res) => res.json()),

    // Данные для модалки только если нужны
    filters.postId ?
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${filters.postId}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json())
    : null,
  ])

  //if (filters.action !== 'create') {
  // const responseUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`, {
  //   next: { revalidate: 60 },
  // })
  // dataUserInfo = (await responseUserInfo.json()) as GetProfileByUserIdResponse
  //
  // const responsePosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`, {
  //   next: { revalidate: 30 },
  // })
  // dataPosts = (await responsePosts.json()) as GetPostsByUserIdResponse
  //
  // if (filters.postId) {
  //   const responsePost = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${filters.postId}`, {
  //     next: { revalidate: 60 },
  //   })
  //   dataPostModal = (await responsePost.json()) as GetPostByIdResponse
  // }
  //}

  return (
    <>
      <ProfileHeader userId={userId} dataUserInfo={userData} />
      <ProfilePosts userId={userId} dataPosts={postsData} />
      {filters.postId && (
        <Suspense fallback={<AppLoader />}>
          <ViewPostModal userId={userId} postId={filters.postId} dataPostModal={modalData} dataUserInfo={userData} />
        </Suspense>
      )}
      {filters.action === 'create' && <PostCreate />}
    </>
  )
}
