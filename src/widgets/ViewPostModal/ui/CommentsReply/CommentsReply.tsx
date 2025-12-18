// import { useState } from 'react'
// import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
// import { postsApi, useCreateCommentMutation } from '@/src/entities/post/api/postsApi'
// import s from './CommentsReply.module.scss'
//
// type CommentReplyProps = {
//   postId: string
//   parentCommentId: string
//   onCancel: () => void
// }
//
// export const CommentsReply = ({ postId, parentCommentId, onCancel }: CommentReplyProps) => {
//   const [text, setText] = useState('')
//   const [createComment] = useCreateCommentMutation()
//   const dispatch = useAppDispatch()
//
//   const isDisabled = text.trim().length < 1
//
//   const publishHandler = async () => {
//     const result = await createComment({
//       postId,
//       content: text,
//       parentId: parentCommentId,
//     }).unwrap()
//
//     dispatch(
//       postsApi.util.updateQueryData('getPostComments', { postId }, (draft) => {
//         draft.push(result)
//       }),
//     )
//
//     setText('')
//     onCancel()
//   }
//
//   return (
//     <div className={s.replyForm}>
//       <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='Write your answer...' />
//       <div className={s.actions}>
//         <button onClick={onCancel}>Cancel</button>
//         <button disabled={isDisabled} onClick={publishHandler}>
//           Publish
//         </button>
//       </div>
//     </div>
//   )
// }
