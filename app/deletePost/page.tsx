'use client'

import { PostMenuActions } from '@/src/feature/Posts/ui/postMenuActions'

export default function PostDeletePage() {
  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Post</h1>
      <PostMenuActions
        postId='1' // тестовый id поста
        // description='Это тестовый пост, чтобы проверить работу меню.'
      />
    </div>
  )
}
