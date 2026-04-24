'use client'

import { MouseEvent } from 'react'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { Button } from '@/src/shared/ui'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'

import { TextArea } from '@/src/shared/ui/TextArea/TextArea'
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'
import Image from 'next/image'
import s from './PostCreateModal.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { userProfileApi } from '@/src/entities/userProfile/api/userProfileApi'
import { useSelector } from 'react-redux'
import { PublicationFormData, UploadedFile } from '@/src/features/post/postCreate/model/types'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
  onOverlayClick: () => void
  changePrevStep: () => void
  uploadedFiles: UploadedFile[]
  currentImageIndex: number
  control: Control<PublicationFormData>
  errors: FieldErrors<PublicationFormData>
  handleSubmit: UseFormHandleSubmit<PublicationFormData>
  onFormSubmit: (data: PublicationFormData) => void
  isLoadingStatus: boolean
}

export const PublicationStep = ({
  isModalOpen,
  onModalClose,
  onOverlayClick,
  changePrevStep,
  uploadedFiles,
  currentImageIndex,
  control,
  errors,
  handleSubmit,
  onFormSubmit,
  isLoadingStatus,
}: Props) => {
  const { data: meData } = useGetMeQuery()
  const userProfile = useSelector(userProfileApi.endpoints.getProfileByUsedId.select({ userId: meData?.id || '' }))

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick()
    }
  }

  const publicationSlides = uploadedFiles.map((file, index) => ({
    id: index,
    content: (
      <div className={s.slideContent}>
        <Image
          src={file.filteredImage?.preview || file.croppedImage || file.preview}
          alt={'Download img'}
          objectPosition={'top'}
          width={400}
          height={400}
        />
      </div>
    ),
  }))

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      onOverlayClick={handleOverlayClick}
      modalTitle={'Publication'}
      withoutPadding
      hideCloseButton
      hideDefaultButton
      animationMode={false}
      buttonLeftInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
          <IconArrowIosBackOutline />
        </Button>
      }
      buttonRightInModalHeader={
        <Button
          tagType={'button'}
          variant={'text'}
          withoutPadding
          onClick={handleSubmit(onFormSubmit)}
          disabled={isLoadingStatus}
        >
          {isLoadingStatus ? 'Publishing' : 'Publish'}
        </Button>
      }
    >
      <div className={s.publication}>
        <div className={s.publicationImgWrapper}>
          <div className={s.publicationImg}>
            <CustomSwiper
              slides={publicationSlides}
              className={s.customSwiper}
              swiperProps={{ initialSlide: currentImageIndex }}
            />
          </div>
        </div>

        <div className={s.publicationContent}>
          <div className={s.publicationProfile}>
            <div className={s.publicationProfileImage}>
              <UserAvatar
                mode={'size'}
                width={36}
                height={36}
                avatarOwner={userProfile.data?.avatars?.medium?.url}
                userName={userProfile.data?.userName || ''}
              />
            </div>
            <strong className={s.publicationProfileURL}>{userProfile.data?.userName}</strong>
          </div>
          <form onSubmit={handleSubmit(onFormSubmit)} className={s.form}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  id='description'
                  className={s.textarea}
                  error={errors.description?.message}
                  label={'Add publication descriptions'}
                  placeholder='Enter the text'
                  rows={5}
                  maxLength={500}
                  withCounter
                />
              )}
            />
          </form>
        </div>
      </div>
    </Modal>
  )
}
