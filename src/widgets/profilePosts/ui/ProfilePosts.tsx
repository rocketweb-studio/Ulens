'use client'

import s from './profilePosts.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import Image from 'next/image'
import { PostMenuActions } from '@/src/widgets/postMenuActions'
import { GetPostsByUserIdResponse } from '@/src/entities/post/api/postsApi.types'
import { useGetPostsByUsedIdQuery } from '@/src/entities/post/api/postsApi'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { IconPlusSquareOutline } from '@rocketweb-studio/ulens-ui-kit'

type Props = {
  userId: string
  dataPosts?: GetPostsByUserIdResponse
}

export const ProfilePosts = ({ userId, dataPosts }: Props) => {
  const { data: meData } = useGetMeQuery()
  const { data: postsData } = useGetPostsByUsedIdQuery({ userId })
  const postsDataForRender = postsData?.items || dataPosts?.items

  return (
    <div className={s.profilePosts}>
      {!postsDataForRender?.length && userId === meData?.id && (
        <Link href={Path.UserCreate(userId)}>
          <div className={s.emptyPost}>
            <IconPlusSquareOutline height={50} width={50} />
            <span>Create your first post</span>
          </div>
        </Link>
      )}
      {postsDataForRender?.map((post) => (
        <div key={post.id} id={post.id} className={s.postItem} style={{ position: 'relative' }}>
          <PostMenuActions postOwnerId={post.ownerId} postId={post.id} userId={userId} className={s.postMenuActions} />
          <Link href={Path.ViewPost(userId, post.id)} scroll={false}>
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
