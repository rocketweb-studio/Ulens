'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { useRouter } from 'next/navigation'
import s from './ViewPostModal.module.scss'
import Image from 'next/image'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { MouseEvent, useState } from 'react'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { GetPostByIdResponse, GetPostCommentsType } from '@/src/entities/post/api/postsApi.types'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'
import { CreatePostComment } from '@/src/features/post/postCreateComment'
import { HeadLine } from '@/src/widgets/ViewPostModal/ui/HeadLine/HeadLine'
import { Description } from '@/src/widgets/ViewPostModal/ui/Description/Description'
import { Comments } from '@/src/widgets/ViewPostModal/ui/Comments/Comments'
import { Actions } from '@/src/widgets/ViewPostModal/ui/Actions/Actions'

type Props = {
  hardLoad?: boolean
  dataPostModal: GetPostByIdResponse
  commentsData: GetPostCommentsType
}

export const ViewPostModal = ({ dataPostModal, commentsData, hardLoad }: Props) => {
  const { data: meData } = useGetMeQuery()
  const { back, replace } = useRouter()
  const { isOpen, closeModal } = useModal(true)
  const [editMode, setEditMode] = useState(false)

  const slides = dataPostModal?.images.medium.map((image, index) => ({
    id: index,
    content: (
      <div className={s.slideImageWrapper}>
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
          alt={''}
          width={image.width}
          height={image.height}
        />
      </div>
    ),
  }))

  const handleSetEditMode = () => {
    setEditMode(!editMode)
  }
  const handleCloseModal = () => {
    hardLoad ? replace(`/profile/${dataPostModal?.ownerId}`) : back()
    closeModal()
  }

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCloseModal()
  }

  if (!dataPostModal) {
    return null
  }

  return (
    <Modal
      className={`${s.modal} ${s.viewPostModal}`}
      isOpen={isOpen}
      onClose={handleCloseModal}
      onOverlayClick={onOverlayClick}
      modalTitle={''}
      withoutPadding
      hideCloseButton
      hideDefaultButton
      animationMode={!hardLoad}
      entity={'postModal'}
    >
      <div className={s.publication}>
        <div className={s.publicationImg}>
          {dataPostModal.images && <CustomSwiper slides={slides || []} className={s.customSwiper} />}
        </div>
        <div className={s.publicationContent}>
          <HeadLine
            dataPostModal={dataPostModal}
            handleCloseModal={handleCloseModal}
            handleSetEditMode={handleSetEditMode}
          />
          <Description description={dataPostModal.description} editMode={editMode} postId={dataPostModal.id} />
          {!editMode && (
            <>
              <Comments commentsData={commentsData} meData={meData} />
              <Actions dataPostModal={dataPostModal} meData={meData} />
              <CreatePostComment postId={dataPostModal.id} meData={meData} />
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
