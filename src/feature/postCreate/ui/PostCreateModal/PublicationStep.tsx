'use client'

import { MouseEvent } from 'react'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'
import { TextArea } from '@/src/shared/components/TextArea/TextArea'
import { Controller, Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'
import { PublicationFormData, UploadedFile } from '@/src/feature/postCreate/types/types'
import Image from 'next/image'
import s from './PostCreateModal.module.scss'

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
}: Props) => {
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
      buttonLeftInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
          <IconArrowIosBackOutline />
        </Button>
      }
      buttonRightInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={handleSubmit(onFormSubmit)}>
          Publish
        </Button>
      }
    >
      <div className={s.publication}>
        <div className={s.publicationImgWrapper}>
          <div className={s.publicationImg}>
            <CustomSwiper
              slides={publicationSlides}
              navigation
              pagination
              className={s.customSwiper}
              allowTouchMove={false}
              swiperProps={{
                spaceBetween: 0,
                slidesPerView: 1,
                initialSlide: currentImageIndex,
                noSwiping: true,
                noSwipingClass: 'swiper-slide',
                preventInteractionOnTransition: true,
              }}
            />
          </div>
        </div>

        <div className={s.publicationContent}>
          <div className={s.publicationProfile}>
            <div className={s.publicationProfileImage}>
              <Image src={'/avatar/avatar_mini.png'} alt={'Avatar'} width={36} height={36} />
            </div>
            <p className={s.publicationProfileURL}> URLProfile</p>
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
