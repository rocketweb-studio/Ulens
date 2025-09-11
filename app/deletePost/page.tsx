'use client'

import { PostDelete } from '@/src/feature/Posts/ui/postDelete'

export default function PostDeletePage() {
  return (
    <div>
      <h1>Post 1</h1>
      <PostDelete
        postId='1' // тестовый id поста
        description='Это тестовый пост, чтобы проверить работу меню.'
      />
    </div>
  )
}
