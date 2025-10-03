'use client'

import s from '@/src/feature/userProfile/ui/ProfilePosts/profilePosts.module.scss'
import {PostMenuActions} from '@/src/feature/Posts/ui/postMenuActions'
import Link from 'next/link'
import {Path} from '@/src/shared/constants/Path'
import Image from 'next/image'
import {useGetMeQuery} from '@/src/feature/auth/api/authApi'
import {useGetPostsByUsedIdQuery} from '@/src/feature/Posts/api/postsApi'
import {GetPostsByUserIdResponse} from "@/src/feature/Posts/api/postsApi.types";

type Props = {
  userId: string
  dataPosts: GetPostsByUserIdResponse
}

export const ProfilePosts = ({ userId, dataPosts }: Props) => {
  const { data: meData } = useGetMeQuery()
  const { data: postsData } = useGetPostsByUsedIdQuery({ userId })

  const postsDataForRender = postsData?.items || dataPosts.items

  return (
    <div className={s.profilePosts}>
      {postsDataForRender.map((post) => (
        <div key={post.id} id={post.id} className={s.postItem} style={{position: 'relative'}}>
          {meData?.id && (
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
                // width={post.images.small[0].width}
                // height={post.images.small[0].height}
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
