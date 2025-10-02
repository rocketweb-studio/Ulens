'use client'

import s from '@/src/feature/userProfile/ui/UserProfile/userProfile.module.scss'
import { PostMenuActions } from '@/src/feature/Posts/ui/postMenuActions'
import Link from 'next/link'
import { Path } from '@/src/shared/constants/Path'
import Image from 'next/image'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'
import { useGetPostsByUsedIdQuery } from '@/src/feature/Posts/api/postsApi'
import { Skeleton } from '@/src/shared/components/Skeleton/Skeleton'

type Props = {
  userId: string
}

export const ProfilePosts = ({ userId }: Props) => {
  const { data: meData } = useGetMeQuery()
  const { data: posts, isLoading } = useGetPostsByUsedIdQuery({ userId })

  if (isLoading) {
    return (
      <div className={s.profilePosts}>
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
        <Skeleton className={s.postItem} />
      </div>
    )
  }

  return (
    <div className={s.profilePosts}>
      {posts?.items.map((post) => (
        <div key={post.id} id={post.id} className={s.postItem}>
          {post.ownerId === meData?.id && (
            <PostMenuActions
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
              />
            )}
          </Link>
        </div>
      ))}
    </div>
  )
}
