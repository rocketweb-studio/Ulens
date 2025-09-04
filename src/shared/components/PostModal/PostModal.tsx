"use client"

export default function PostModal({ postId }: { postId?: string }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      <h2>Пост # {postId} </h2>
      <p>Здесь контент поста...</p>
    </div>
  )
}
