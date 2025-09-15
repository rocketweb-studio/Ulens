'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { PostMenuActions } from '@/src/feature/Posts/ui/postMenuActions'
import {PostCreateModal} from "@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal";

export default function CreatePostModal() {
  const { isOpen, closeModal } = useModal(true)
  return (
    <FlexContainer align={'center'} justify={'center'}>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <PostMenuActions postId={'1'}></PostMenuActions>
      </div>
      <h2>Создать пост</h2>
      <form>
        <textarea placeholder='Текст поста' style={{ width: '100%' }} />
        <button type='submit'>Опубликовать</button>
      </form>
      <PostCreateModal isModalOpen={true} onModalClose={closeModal} />
    </FlexContainer>
  )
}
