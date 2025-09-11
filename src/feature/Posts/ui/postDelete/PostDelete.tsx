'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import { useDeletePostMutation } from '@/src/feature/Posts/api/postsApi'
import { Path } from '@/src/shared/constants/Path'

type Props = {
  postId: string
  description: string
}

export const PostDelete = ({ postId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [deletePost, { isLoading }] = useDeletePostMutation()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deletePost(postId).unwrap()
      setIsOpen(false)
      router.push(Path.Profile) // после удаления уводим на домашнюю страницу
    } catch (e) {
      console.error('Ошибка удаления поста', e)
    }
  }

  return (
    <>
      {/* Иконка "три точки" */}
      <div>
        <button onClick={() => setIsOpen(true)}>⋮</button>
      </div>

      {/* Модалка подтверждения */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} modalTitle='Delete Post' hideDefaultButton>
        <p>Are you sure you want to delete this post?</p>
        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={() => setIsOpen(false)} disabled={isLoading}>
            No
          </Button>
          <Button onClick={handleDelete} disabled={isLoading}>
            Yes
          </Button>
        </div>
      </Modal>
    </>
  )
}
