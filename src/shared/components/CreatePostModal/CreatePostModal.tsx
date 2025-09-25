'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { PostCreateModal } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'
import { useRouter } from 'next/navigation'
import { Path } from '@/src/shared/constants/Path'

export default function CreatePostModal() {
  const { isOpen, closeModal, openModal } = useModal(true)
  const { replace } = useRouter()

  const onModalCloseHandler = () => {
    closeModal()
    replace(Path.Profile)
  }

  return (
    <FlexContainer align={'center'} justify={'center'}>
      <PostCreateModal isModalOpen={isOpen} onModalClose={onModalCloseHandler} />
    </FlexContainer>
  )
}
