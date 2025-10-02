'use client'

import React, { MouseEvent, useEffect, useMemo, useCallback } from 'react'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'
import { ImageCropper } from '@/src/shared/components/ImageCropper/ImageCropper'
import { UploadedFile } from '@/src/feature/postCreate/types/types'
import { Area } from 'react-easy-crop'
import Image from 'next/image'
import s from './PostCreateModal.module.scss'
import { getCroppedImg } from '@/src/shared/components/ImageCropper/model'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
  onOverlayClick: () => void
  changeNextStep: () => void
  changePrevStep: () => void
  uploadedFiles: UploadedFile[]
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
  setUploadedFiles: (files: UploadedFile[]) => void
}

export const CropStep = ({
  isModalOpen,
  onModalClose,
  onOverlayClick,
  changeNextStep,
  changePrevStep,
  uploadedFiles,
  currentImageIndex,
  setCurrentImageIndex,
  setUploadedFiles,
}: Props) => {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick()
    }
  }

  const handleAspectRatioChange = (aspectRatio: 'original' | '1:1' | '4:5' | '16:9', index?: number) => {
    const targetIndex = index !== undefined ? index : currentImageIndex
    const updatedFiles = uploadedFiles.map((file, i) => (i === targetIndex ? { ...file, aspectRatio } : file))
    setUploadedFiles(updatedFiles)
  }

  const handleCropAreaChange = (areaPixels: Area, index?: number) => {
    const targetIndex = index !== undefined ? index : currentImageIndex
    const updatedFiles = uploadedFiles.map((file, i) =>
      i === targetIndex ? { ...file, croppedAreaPixels: areaPixels } : file,
    )
    setUploadedFiles(updatedFiles)
  }

  const handleNextStep = async () => {
    try {
      const cropPromises = uploadedFiles.map(async (file, index) => {
        if (file.croppedAreaPixels && file.croppedAreaPixels.width > 0 && file.croppedAreaPixels.height > 0) {
          const croppedImage = await getCroppedImg(file.originalPreview, file.croppedAreaPixels)
          return {
            ...file,
            croppedImage,
            preview: croppedImage,
          }
        } else {
          return {
            ...file,
            croppedImage: file.originalPreview,
            preview: file.originalPreview,
          }
        }
      })

      const croppedFiles = await Promise.all(cropPromises)
      setUploadedFiles(croppedFiles)
      changeNextStep()
    } catch (error) {
      console.error('Error cropping images:', error)
      changeNextStep()
    }
  }

  const cropSlides = uploadedFiles.map((file, index) => ({
    id: index,
    content: (
      <div>
        {/*{index === currentImageIndex ?*/}
        {/*  <MemoizedImageCropper*/}
        {/*    image={file.preview}*/}
        {/*    onCropAreaChange={(areaPixels) => handleCropAreaChange(areaPixels, index)}*/}
        {/*    onAspectRatioChange={(aspectRatio) => handleAspectRatioChange(aspectRatio, index)}*/}
        {/*    initialAspectRatio={file.aspectRatio || 'original'}*/}
        {/*    isActiveSlide={true}*/}
        {/*  />*/}
        {/*: <div className={s.slidePlaceholder}>*/}
        {/*    <Image src={file.preview} alt={`Preview ${index + 1}`} fill />*/}
        {/*  </div>*/}
        {/*}*/}

        <MemoizedImageCropper
          image={file.preview}
          onCropAreaChange={(areaPixels) => handleCropAreaChange(areaPixels, index)}
          onAspectRatioChange={(aspectRatio) => handleAspectRatioChange(aspectRatio, index)}
          initialAspectRatio={file.aspectRatio || 'original'}
          isActiveSlide={true}
        />
      </div>
    ),
  }))

  const handleSlideChange = useCallback(
    (swiper: any) => {
      setCurrentImageIndex(swiper.activeIndex)
    },
    [setCurrentImageIndex],
  )

  return (
    <Modal
      className={`${s.modal} ${s.cropModal}`}
      isOpen={isModalOpen}
      onClose={onModalClose}
      onOverlayClick={handleOverlayClick}
      modalTitle={'Cropping'}
      withoutPadding
      hideCloseButton
      hideDefaultButton
      buttonRightInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={handleNextStep}>
          Next
        </Button>
      }
      buttonLeftInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
          <IconArrowIosBackOutline />
        </Button>
      }
    >
      <CustomSwiper
        slides={cropSlides}
        navigation={true}
        pagination={true}
        className={s.customSwiper}
        allowTouchMove={false}
        onSlideChange={handleSlideChange}
        swiperProps={{
          spaceBetween: 0,
          slidesPerView: 1,
          initialSlide: currentImageIndex,
          noSwiping: true,
          noSwipingClass: 'swiper-slide',
          preventInteractionOnTransition: true,
        }}
      />
    </Modal>
  )
}

const MemoizedImageCropper = React.memo(ImageCropper, (prevProps, nextProps) => {
  return (
    prevProps.image === nextProps.image &&
    prevProps.initialAspectRatio === nextProps.initialAspectRatio &&
    prevProps.isActiveSlide === nextProps.isActiveSlide
  )
})
