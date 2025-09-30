'use client'

import {useGetLastPostsQuery} from "@/src/feature/publicPage/api/publicPageApi";
import {GetPostByIdResponse} from "@/src/feature/Posts/api/postsApi.types";
import {CustomSwiper} from "@/src/shared/components/CustomSwiper";
import s from "./PublicPage.module.scss";
import Image from "next/image";
import {Path} from "@/src/shared/constants/Path";
import Link from "next/link";
import {timeAgo} from "@/src/shared/utils/timeAgo";
import {UserAvatar} from "@/src/shared/components/UserAvatar";

type Props = {
  data: GetPostByIdResponse[] | undefined
}

export const PublicPage = ({data}: Props) => {
  const {data: Posts} = useGetLastPostsQuery(undefined, {
    pollingInterval: 20000,
  })

  console.log(Posts)

  data = Posts ? Posts.slice(0, 4) : data?.slice(0, 4)

  return <div className={s.publicPageWrapper}>

    <div className={s.boxModel}>
      <h2 className={s.registeredUser}>Registered users:</h2>
      <div className={s.countWrapper}>
        <h2 className={s.countText}>0</h2>
        <h2 className={s.countText}>0</h2>
        <h2 className={s.countText}>9</h2>
        <h2 className={s.countText}>2</h2>
        <h2 className={s.countText}>1</h2>
        <h2 className={s.countText}>3</h2>
      </div>
    </div>
    <div className={s.postsContainer}>


      {data?.map((post) => (
        <div key={post.id} className={s.postWrapper}>

          {post.images && (
            <div key={post.id} className={s.swiperWrapper}>
              {/*<Link href={Path.ViewPost(post.ownerId, post.id)}> </Link>*/}
              <CustomSwiper
                slides={post.images.medium.map((image, index) => ({
                  id: index,
                  content: (
                    <div className={s.slideImageWrapper}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                        alt={''}
                        width={image.width}
                        height={image.height}
                      />
                    </div>
                  ),
                }))}
                className={s.customSwiper}
                allowTouchMove={false}
                swiperProps={{
                  spaceBetween: 0,
                  slidesPerView: 1,
                  initialSlide: 0,
                  noSwiping: true,
                  noSwipingClass: 'swiper-slide',
                  preventInteractionOnTransition: true,
                }}
              />

            </div>
          )}
          <div className={s.ownerWrapper}>
            {/*{post.avatarOwner*/}
            {/*? <Image className={s.avatar} src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${post.avatarOwner}`}*/}
            {/*         alt={'avatar'} height={36} width={36}></Image>*/}
            {/*: <div className={s.avatar}>*/}
            {/*    {post.userName.slice(0,2).toUpperCase()}*/}
            {/*  </div>}*/}
            <UserAvatar userName={post.userName} width={36} height={36} avatarOwner={post.avatarOwner}/>

            <h3>{post.userName}</h3>
          </div>

          <p className={s.dateText}>{timeAgo(post.createdAt)}</p>
          <p className={s.description}>{post.description}</p>

        </div>
      ))}


    </div>

  </div>
}
