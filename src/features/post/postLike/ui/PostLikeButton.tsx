'use client'

import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { useToggleLikePostMutation } from '@/src/entities/post/api/postsApi'
import s from './PostLikeButton.module.scss'

type Props = {
  postId: string
  isLiked: boolean
  likeCount: number
  onChange?: (isLiked: boolean, likeCount: number) => void
}

export const PostLikeButton = ({ postId, isLiked, likeCount, onChange }: Props) => {
  const [toggleLikePost] = useToggleLikePostMutation()

  const handleLikeClick = () => {
    const newIsLiked = !isLiked
    const newLikeCount = likeCount + (isLiked ? -1 : 1)

    onChange?.(newIsLiked, newLikeCount)

    toggleLikePost({
      postId,
      like: newIsLiked,
    })
  }

  return (
    <button onClick={handleLikeClick} className={`${s.likeButton} ${isLiked ? s.liked : ''}`}>
      {isLiked ?
        <IconHeart />
      : <IconHeartOutline />}
    </button>
  )
}
