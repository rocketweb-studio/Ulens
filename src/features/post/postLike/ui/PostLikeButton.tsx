'use client'

import { useState } from 'react'
import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { useToggleLikePostMutation } from '@/src/entities/post/api/postsApi'
import s from './PostLikeButton.module.scss'

type Props = {
  postId: string
  initialIsLiked: boolean
  initialLikeCount: number
  onChange?: (isLiked: boolean, likeCount: number) => void
}

export const PostLikeButton = ({ postId, initialIsLiked, initialLikeCount, onChange }: Props) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)

  const [toggleLikePost] = useToggleLikePostMutation()

  const handleLikeClick = async () => {
    // try {
    //   await toggleLikePost({
    //     postId,
    //     like: !isLiked,
    //   }).unwrap()

    const optimisticIsLiked = !isLiked
    const optimisticLikeCount = likeCount + (isLiked ? -1 : 1)

    setIsLiked(optimisticIsLiked)
    setLikeCount(optimisticLikeCount)

    onChange?.(optimisticIsLiked, optimisticLikeCount)

    toggleLikePost({ postId, like: optimisticIsLiked })
      .unwrap()
      .catch(() => {
        setIsLiked(isLiked)
        setLikeCount(likeCount)
        onChange?.(isLiked, likeCount)
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
