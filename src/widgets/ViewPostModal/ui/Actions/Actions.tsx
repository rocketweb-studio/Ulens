import React, { useState } from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Actions/Actions.module.scss'
import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import Image from 'next/image'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { useToggleLikePostMutation } from '@/src/entities/post/api/postsApi'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'
import { PostLikeButton } from '@/src/features/post/postLike'

type Props = {
  dataPostModal: GetPostByIdResponse
  meData: getMeResponse | undefined
}

export const Actions = ({ dataPostModal, meData }: Props) => {
  // const [isLiked, setIsLiked] = useState(dataPostModal?.isLiked)
  // const [likeCount, setLikeCount] = useState(dataPostModal?.likeCount ?? 0)
  //const [toggleLikePost] = useToggleLikePostMutation()

  const [isLiked, setIsLiked] = useState<boolean>(dataPostModal?.isLiked ?? false)
  const [likeCount, setLikeCount] = useState<number>(dataPostModal?.likeCount ?? 0)

  return (
    <div className={s.postData}>
      {meData && (
        <div className={s.postActions}>
          <div className={s.postActionsLeft}>
            <PostLikeButton
              postId={dataPostModal.id}
              initialIsLiked={dataPostModal.isLiked ?? false}
              initialLikeCount={dataPostModal.likeCount ?? 0}
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
        {/*<span>{`${dataPostModal.likeCount || ''} "Like"`}</span>*/}
      </div>
      <span className={s.date}>{formatDate(dataPostModal.createdAt)}</span>
    </div>
  )
}
