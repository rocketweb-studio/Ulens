'use client'

import {GetPostByIdResponse} from "@/src/feature/Posts/api/postsApi.types";
import {CustomSwiper} from "@/src/shared/components/CustomSwiper";
import s from "./PublicPage.module.scss";
import Image from "next/image";
import {timeAgo} from "@/src/shared/utils/timeAgo";
import {UserAvatar} from "@/src/shared/components/UserAvatar";
import Link from "next/link";
import {Path} from "@/src/shared/constants/Path";

type Props = {
  data: GetPostByIdResponse[] | undefined
}

export const PublicPage = ({data}: Props) => {


  data = data?.slice(0, 4)

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
            <Link href={Path.ViewPost(post.ownerId, post.id)} key={post.id}>
              <div className={s.swiperWrapper}>

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
            </Link>
          )}
          <div className={s.ownerWrapper}>

            <UserAvatar userName={post.userName} width={36} height={36} avatarOwner={post.avatarOwner}
                        userId={post.ownerId}/>

            <Link href={Path.UserProfile(post.ownerId)} className={s.userName}>{post.userName}</Link>
          </div>

          <p className={s.dateText}>{timeAgo(post.createdAt)}</p>
          <p className={s.description}>{post.description}</p>

        </div>
      ))}


    </div>

  </div>
}
