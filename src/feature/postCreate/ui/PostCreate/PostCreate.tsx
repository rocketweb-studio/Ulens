'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { PostCreateModal } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'
import { useRouter } from 'next/navigation'
import { updateSearchParams } from '@/src/shared/utils'

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
