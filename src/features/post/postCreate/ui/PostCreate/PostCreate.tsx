'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from 'src/shared/ui/FlexContainer'
import { useRouter } from 'next/navigation'
import { updateSearchParams } from '@/src/shared/utils'
import { PostCreateModal } from '@/src/features/post/postCreate/ui/PostCreateModal/PostCreateModal'

export const PostCreate = () => {
  const { isOpen, closeModal } = useModal(true)
  const router = useRouter()

  const onModalCloseHandler = () => {
    closeModal()
    updateSearchParams({ action: '' }, router)
  }

  return (
    <FlexContainer align={'center'} justify={'center'}>
      <PostCreateModal isModalOpen={isOpen} onModalClose={onModalCloseHandler} />
    </FlexContainer>
  )
}
