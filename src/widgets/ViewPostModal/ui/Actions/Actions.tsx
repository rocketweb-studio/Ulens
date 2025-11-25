import React, { useEffect, useState } from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Actions/Actions.module.scss'
import Image from 'next/image'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'
import { PostLikeButton } from '@/src/features/post/postLike'

type Props = {
  dataPostModal: GetPostByIdResponse
  meData: getMeResponse | undefined
}

export const Actions = ({ dataPostModal, meData }: Props) => {
  const calculatedIsLiked = dataPostModal.avatarWhoLikes?.some((u) => u.userId === meData?.id) ?? false

  const [isLiked, setIsLiked] = useState(calculatedIsLiked)
  const [likeCount, setLikeCount] = useState(dataPostModal.likeCount)

  useEffect(() => {
    const isLikedFromList = dataPostModal.avatarWhoLikes?.some((u) => u.userId === meData?.id) ?? false

    setIsLiked(isLikedFromList)
    setLikeCount(dataPostModal.likeCount)
  }, [dataPostModal, meData?.id])

  return (
    <div className={s.postData}>
      {meData && (
        <div className={s.postActions}>
          <div className={s.postActionsLeft}>
            <PostLikeButton
              postId={dataPostModal.id}
              isLiked={isLiked}
              likeCount={likeCount}
              onChange={(newIsLiked, newLikeCount) => {
                setIsLiked(newIsLiked)
                setLikeCount(newLikeCount)
              }}
            />
            <Image width={24} height={24} src={'/savedPost.svg'} alt={'Saved'} />
          </div>
          <Image width={24} height={24} src={'/sendPost.svg'} alt={'Send'} />
        </div>
      )}
      <div className={s.likesPostContainer}>
        <div className={s.likeImagesContainer}>
          {/*{dataPostModal.avatarWhoLikes.slice(0 , 3).map((user) => (*/}
          {/*    <Image key={user.id} className={s.likeImage} width={24} height={24} src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${user.images}`} alt={user.userName} />*/}
          {/*))}*/}
          <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
          <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
          <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
        </div>
        <span>
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </span>
      </div>
      <span className={s.date}>{formatDate(dataPostModal.createdAt)}</span>
    </div>
  )
}
