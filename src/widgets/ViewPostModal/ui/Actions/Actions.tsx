import React, { useEffect, useState } from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Actions/Actions.module.scss'
import Image from 'next/image'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'
import { LikeButton } from '@/src/features/post/postLike'

type Props = {
  dataPostModal: GetPostByIdResponse
  meData: getMeResponse | undefined
}

export const Actions = ({ dataPostModal, meData }: Props) => {
  const calculatedIsLiked = dataPostModal.avatarWhoLikes?.some((u) => u.userId === meData?.id) ?? false

  const [isLiked, setIsLiked] = useState(calculatedIsLiked)
  const [likeCount, setLikeCount] = useState(dataPostModal.likeCount)
  const [avatarWhoLikes, setAvatarWhoLikes] = useState(dataPostModal.avatarWhoLikes ?? [])

  const handleLikeChange = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    if (!meData) return

    if (newIsLiked) {
      setAvatarWhoLikes((prev) => [
        {
          userId: meData.id,
          avatars: dataPostModal.avatarWhoLikes[0].avatars,
        },
        ...prev.filter((u) => u.userId !== meData.id),
      ])
    } else {
      setAvatarWhoLikes((prev) => prev.filter((u) => u.userId !== meData.id))
    }
  }

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
            <LikeButton
              itemId={dataPostModal.id}
              itemType={'POST'}
              isLiked={isLiked}
              likeCount={likeCount}
              onChange={handleLikeChange}
              // onChange={(newIsLiked, newLikeCount) => {
              //   setIsLiked(newIsLiked)
              //   setLikeCount(newLikeCount)
              // }}
            />
            <Image width={24} height={24} src={'/savedPost.svg'} alt={'Saved'} />
          </div>
          <Image width={24} height={24} src={'/sendPost.svg'} alt={'Send'} />
        </div>
      )}
      <div className={s.likesPostContainer}>
        <div className={s.likeImagesContainer}>
          {avatarWhoLikes.slice(0, 3).map((user) => (
            <Image
              key={user.userId}
              className={s.likeImage}
              width={24}
              height={24}
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${user.avatars.small?.url ?? ''}`}
              alt={'/github-svg.svg'}
            />
          ))}
        </div>
        <span>
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </span>
      </div>
      <span className={s.date}>{formatDate(dataPostModal.createdAt)}</span>
    </div>
  )
}
