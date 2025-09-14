'use client'

import { PostCreateModal } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'
import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'

export default function CreatePostModal() {
  const { isOpen, closeModal } = useModal(true)
  return (
    <FlexContainer align={'center'} justify={'center'}>
      {/*//   <div style={{ display: 'flex', justifyContent: 'end' }}>*/}
      {/*//     <PostMenuActions postId={'1'}></PostMenuActions>*/}
      {/*//   </div>*/}
      {/*//   <h2>Создать пост</h2>*/}
      {/*//   <form>*/}
      {/*//     <textarea placeholder='Текст поста' style={{ width: '100%' }} />*/}
      {/*//     <button type='submit'>Опубликовать</button>*/}
      {/*//   </form>*/}
      <PostCreateModal isModalOpen={isOpen} onModalClose={closeModal} />
    </FlexContainer>
  )
}
