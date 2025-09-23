'use client'

import Image from 'next/image'
import s from './userProfile.module.scss'
import photo3 from '@/src/assets/postsTmp/3.png'
import {UserProfileActions} from "@/src/feature/userProfile/ui/UserProfile/UserProfileActions/UserProfileActions";
import {useGetPostsByUsedIdQuery} from "@/src/feature/Posts/api/postsApi";
import {PostMenuActions} from "@/src/feature/Posts/ui/postMenuActions";
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";
import {Path} from "@/src/shared/constants/Path";
import Link from "next/link";
import {useGetProfileByUsedIdQuery} from "@/src/feature/userProfile/api/userProfileApi";

type Props = {
  userId: string
}

export const UserProfile = ({ userId }: Props) => {

    const {data: meData} = useGetMeQuery()
    const {data: posts} = useGetPostsByUsedIdQuery({userId})
    const {data: user} = useGetProfileByUsedIdQuery({userId})

    return (
      <div className={s.profileWrapper}>
        <div className={s.profileHeader}>
          <div className={s.profileAvatar}>
              {user && user?.avatars?.length > 0
                  ? <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${user?.avatars[0].url}`} alt={'avatar'}/>
                  : <Image src={photo3} alt={'avatar'}/>
              }

          </div>
          <div className={s.profileInfo}>
              <div className={s.nameAndFollowRow}>
                  <h1>{user?.userName}</h1>
                  <UserProfileActions/>
              </div>
              <div className={s.statisticRow}>
                  <div className={s.statisticItem}>
                      <strong>{user?.following}</strong>
                      <span>Following</span>
                  </div>
                  <div className={s.statisticItem}>
                      <strong>{user?.followers}</strong>
                      <span>Followers</span>
                  </div>
                  <div className={s.statisticItem}>
                      <strong>{user?.publicationsCount}</strong>
                      <span>Publications</span>
                  </div>
              </div>
              <div className={s.aboutUser}>
                  {user?.aboutMe ? user.aboutMe :
                  <span>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolor ex hic iusto nulla optio
                      sed totam voluptatem? Adipisci aliquid amet corporis deleniti earum eligendi error ipsum iste labore
                      nobis, perferendis quas quasi rem soluta suscipit veniam vero voluptatem voluptatum? Accusamus aliquam
                      architecto facilis ipsa, maxime non quasi quis sit. Adipisci aliquid amet corporis deleniti earum
                      eligendi error ipsum iste labore nobis, perferendis quas quasi rem soluta suscipit veniam vero
                      voluptatem voluptatum? Accusamus aliquam architecto facilis ipsa, maxime non quasi quis sit.
                  </span>
                  }
              </div>
          </div>
        </div>
        <div className={s.profilePosts}>
            {posts?.items.map(post => (
                <div key={post.id} id={post.id} className={s.postItem}>
                    {post.ownerId === meData?.id && <PostMenuActions postId={post.id} description={''}></PostMenuActions>}
                    <Link href={Path.ViewPost(userId, post.id)}>
                        {post.images.length > 0 && <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${post.images[0].url}`} alt={post.description} fill style={{ objectFit: 'cover' }}/>}
                    </Link>
                </div>
            ))}
        </div>
      </div>
  )
}