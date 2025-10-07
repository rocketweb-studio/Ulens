'use client'

import React, { MouseEvent, useState } from 'react'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { Button } from '@/src/shared/ui'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { ImageCropper } from '@/src/features/post/postCreate/lib/ImageCropper/ImageCropper'
import { Area } from 'react-easy-crop'
import Image from 'next/image'
import s from './PostCreateModal.module.scss'
import { UploadedFile } from '@/src/features/post/postCreate/model/types'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'
import { getCroppedImg } from '@/src/features/post/postCreate/utils/getCroppedImage'

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
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick()
    }
  }

  const handleAspectRatioChange = (aspectRatio: 'original' | '1:1' | '4:5' | '16:9', index: number) => {
    const updatedFiles = uploadedFiles.map((file, i) => (i === index ? { ...file, aspectRatio } : file))
    setUploadedFiles(updatedFiles)
  }

  const handleCropAreaChange = (areaPixels: Area, index: number) => {
    const updatedFiles = uploadedFiles.map((file, i) =>
      i === index ? { ...file, croppedAreaPixels: areaPixels } : file,
    )
    setUploadedFiles(updatedFiles)
  }

  const handleZoomChange = (zoom: number, index: number) => {
    const updatedFiles = uploadedFiles.map((file, i) => (i === index ? { ...file, zoom } : file))
    setUploadedFiles(updatedFiles)
  }

  const handleCropChange = (crop: { x: number; y: number }, index: number) => {
    const updatedFiles = uploadedFiles.map((file, i) => (i === index ? { ...file, cropPosition: crop } : file))
    setUploadedFiles(updatedFiles)
  }

  const handleNextStep = async () => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      const updatedFiles = await Promise.all(
        uploadedFiles.map(async (file, index) => {
          if (file.croppedAreaPixels && file.croppedAreaPixels.width > 0 && file.croppedAreaPixels.height > 0) {
            try {
              const croppedImage = await getCroppedImg(file.originalPreview, file.croppedAreaPixels)
              return {
                ...file,
                croppedImage,
                preview: croppedImage,
              }
            } catch (error) {
              console.error(`Error cropping image ${index}:`, error)
              return {
                ...file,
                croppedImage: file.originalPreview,
                preview: file.originalPreview,
              }
            }
          } else {
            return {
              ...file,
              croppedImage: file.originalPreview,
              preview: file.originalPreview,
            }
          }
        }),
      )

      setUploadedFiles(updatedFiles)
      changeNextStep()
    } catch (error) {
      console.error('Error in crop step:', error)
      changeNextStep()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSlideChange = (swiper: any) => {
    setCurrentImageIndex(swiper.activeIndex)
  }

  const cropSlides = uploadedFiles.map((file, index) => ({
    id: index,
    content: (
      <div>
        {index === currentImageIndex ?
          <ImageCropper
            key={`cropper-${index}-${file.originalPreview}`} // Уникальный ключ с изображением
            image={file.originalPreview}
            onCropAreaChange={(areaPixels) => handleCropAreaChange(areaPixels, index)}
            onAspectRatioChange={(aspectRatio) => handleAspectRatioChange(aspectRatio, index)}
            onZoomChange={(zoom) => handleZoomChange(zoom, index)}
            onCropChange={(crop) => handleCropChange(crop, index)}
            initialAspectRatio={file.aspectRatio || 'original'}
            initialZoom={file.zoom || 1}
            initialCrop={file.cropPosition || { x: 0, y: 0 }}
            isActiveSlide={true}
          />
        : <div className={s.slidePlaceholder}>
            <Image src={file.preview} alt={`Preview ${index + 1}`} fill />
          </div>
        }
      </div>
    ),
  }))

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
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={handleNextStep} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Next'}
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
