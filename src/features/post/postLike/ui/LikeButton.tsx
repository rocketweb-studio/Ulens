'use client'

import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { useToggleLikeMutation } from '@/src/entities/post/api/postsApi'
import s from './LikeButton.module.scss'
import { useEffect, useState } from 'react'

type Props = {
  itemId: string
  itemType: 'POST' | 'COMMENT'
  isLiked: boolean
  likeCount: number
  onChange?: (isLiked: boolean, likeCount: number) => void
}

export const LikeButton = ({ itemId, isLiked, likeCount, onChange, itemType }: Props) => {
  const [toggleLikePost] = useToggleLikeMutation()

  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(likeCount)

  useEffect(() => {
    setLiked(isLiked)
    setLikesCount(likeCount)
  }, [isLiked, likeCount])

  const handleLikeClick = () => {
    const newIsLiked = !liked
    const newLikeCount = likesCount + (liked ? -1 : 1)

    setLiked(newIsLiked)
    setLikesCount(newLikeCount)

    onChange?.(newIsLiked, newLikeCount)

    toggleLikePost({
      likedItemId: itemId,
      likedItemType: itemType,
      like: newIsLiked,
    })
  }

  return (
    <button onClick={handleLikeClick} className={`${s.likeButton} ${liked ? s.liked : ''}`}>
      {liked ?
        <IconHeart />
      : <IconHeartOutline />}
    </button>
  )
}
