'use client'

export default function CreatePostModal() {
  return (
    <div
      style={{
        background: 'white',
        padding: '20px',
        border: '1px solid #ccc',
      }}
    >
      <h2>Создать пост</h2>
      <form>
        <textarea placeholder='Текст поста' style={{ width: '100%' }} />
        <button type='submit'>Опубликовать</button>
      </form>
    </div>
  )
}
