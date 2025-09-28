'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { PostCreateModal } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'
import { useRouter } from 'next/navigation'

export default function CreatePostModal() {
  const { isOpen, closeModal, openModal } = useModal(true)
  const router = useRouter()

  const updateSearchParams = (newParams: Record<string, string>) => {
    const searchParams = new URLSearchParams(window.location.search)

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value)
      } else {
        searchParams.delete(key)
      }
    })

    router.replace(`?${searchParams.toString()}`, { scroll: false })
  }

  const onModalCloseHandler = () => {
    closeModal()
    updateSearchParams({ action: '' })
  }

  return (
    <FlexContainer align={'center'} justify={'center'}>
      <PostCreateModal isModalOpen={isOpen} onModalClose={onModalCloseHandler} />
    </FlexContainer>
  )
}
