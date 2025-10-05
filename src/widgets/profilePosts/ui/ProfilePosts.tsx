'use client'

import s from './profilePosts.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import Image from 'next/image'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { PostMenuActions } from '@/src/widgets/postMenuActions'
import { GetPostsByUserIdResponse } from '@/src/entities/post/api/postsApi.types'
import { useGetPostsByUsedIdQuery } from '@/src/entities/post/api/postsApi'

type Props = {
  userId: string
  dataPosts?: GetPostsByUserIdResponse
}

export const ProfilePosts = ({ userId, dataPosts }: Props) => {
  const { data: meData, isSuccess } = useGetMeQuery()
  const { data: postsData } = useGetPostsByUsedIdQuery({ userId })
  const isAuth = !!meData?.id && isSuccess
  const postsDataForRender = postsData?.items || dataPosts?.items

  return (
    <div className={s.profilePosts}>
      {postsDataForRender?.map((post) => (
        <div key={post.id} id={post.id} className={s.postItem} style={{ position: 'relative' }}>
          {isAuth && (
            <PostMenuActions
              postOwnerId={post.ownerId}
              postId={post.id}
              userId={userId}
              description={''}
              className={s.postMenuActions}
            ></PostMenuActions>
          )}
          <Link href={Path.ViewPost(userId, post.id)}>
            {post.images.small.length > 0 && (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${post.images.small[0].url}`}
                alt={post.description}
                fill
                style={{ objectFit: 'cover' }}
                quality={100}
              />
            )}
          </Link>
        </div>
      ))}
    </div>
  )
}
