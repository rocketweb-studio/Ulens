'use client'

import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { useToggleLikeMutation } from '@/src/entities/post/api/postsApi'
import s from './LikeButton.module.scss'

type Props = {
  itemId: string
  itemType: 'POST' | 'COMMENT'
  isLiked: boolean
  likeCount: number
  onChange?: (isLiked: boolean, likeCount: number) => void
}

export const LikeButton = ({ itemId, isLiked, likeCount, onChange, itemType }: Props) => {
  const [toggleLikePost] = useToggleLikeMutation()

  const handleLikeClick = () => {
    const newIsLiked = !isLiked
    const newLikeCount = likeCount + (isLiked ? -1 : 1)

    onChange?.(newIsLiked, newLikeCount)

    toggleLikePost({
      likedItemId: itemId,
      likedItemType: itemType,
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
