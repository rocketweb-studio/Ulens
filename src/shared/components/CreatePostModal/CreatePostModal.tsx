'use client'

import { PostMenuActions } from '@/src/feature/Posts/ui/postMenuActions'

export default function CreatePostModal() {
  return (
    <div
      style={{
        background: 'white',
        padding: '20px',
        border: '1px solid #ccc',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <PostMenuActions postId={'1'}></PostMenuActions>
      </div>
      <h2>Создать пост</h2>
      <form>
        <textarea placeholder='Текст поста' style={{ width: '100%' }} />
        <button type='submit'>Опубликовать</button>
      </form>
    </div>
  )
}
