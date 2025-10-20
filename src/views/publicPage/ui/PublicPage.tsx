'use client'

import s from './PublicPage.module.scss'
import Image from 'next/image'
import { timeAgo } from '@/src/shared/utils/timeAgo'
import { UserAvatar } from '@/src/entities/userProfile'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'
import { UserCount } from '@/src/widgets/userCount'

type Props = {
  dataPosts: GetPostByIdResponse[] | undefined
  totalUsers: number
}

export const PublicPage = ({ dataPosts, totalUsers }: Props) => {

   const data = Array.isArray(dataPosts)? dataPosts.slice(0, 4) : []

  return (
    <div className={s.publicPageWrapper}>
      <UserCount totalUsers={totalUsers} />
      <div className={s.postsContainer}>
        {data?.map((post) => (
          <div key={post.id} className={s.postWrapper}>
            {post.images && (
              <div className={s.swiperWrapper}>
                <CustomSwiper
                  slides={post.images.medium.map((image, index) => ({
                    id: index,
                    content: (
                      <div className={s.slideImageWrapper}>
                        <Link href={Path.ViewPost(post.ownerId, post.id)} key={post.id}>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                            alt={''}
                            width={image.width}
                            height={image.height}
                          />
                        </Link>
                      </div>
                    ),
                  }))}
                  className={s.customSwiper}
                />
              </div>
            )}

            <Link href={Path.UserProfile(post.ownerId)} scroll={false} className={s.author}>
              <UserAvatar
                mode={'size'}
                userName={post.userName}
                width={36}
                height={36}
                avatarOwner={post.avatarOwner}
              />
              {post.userName}
            </Link>

            <p className={s.dateText}>{timeAgo(post.createdAt)}</p>
            <p className={s.description}>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
