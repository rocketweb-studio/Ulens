'use client'

import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCreatePostMutation, useUploadPostImagesMutation } from '@/src/feature/Posts/api/postsApi'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/src/shared/hooks/useModal'
import { Steps, UploadedFile } from '@/src/feature/postCreate/types/types'
import { FILES_VALIDATE } from '../../consts/consts'
import { publicationSchema } from '../../model/schemas'
import { base64ToFile, dropErrorSnackBar, fileToBase64, getImageDimensions } from '../../utils'
import { AddStep } from './AddStep'
import { CropStep } from './CropStep'
import { FilterStep } from './FilterStep'
import { PublicationStep } from './PublicationStep'
import { ConfirmCloseModal } from './ConfirmCloseModal'
import s from './PostCreateModal.module.scss'
import { getCroppedImg } from '@/src/shared/components/ImageCropper/model'
import { useForm } from 'react-hook-form'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
}

type PublicationFormData = z.infer<typeof publicationSchema>

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [createPost, { isLoading: isLoadingCreatePost }] = useCreatePostMutation()
  const [uploadImages, { isLoading: isLoadingUploadImages }] = useUploadPostImagesMutation()
  const { isOpen, openModal, closeModal } = useModal()
  const [dropError, setDropError] = useState<string | null>(null)
  const [pendingStepChange, setPendingStepChange] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILES_VALIDATE.accept,
    maxFiles: FILES_VALIDATE.maxFiles,
    maxSize: FILES_VALIDATE.maxSize,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: { description: '' },
  })

  async function onDrop(acceptedFiles: File[], rejectedFiles: any[]) {
    setDropError(null)

    const newFiles = await Promise.all(
      acceptedFiles.slice(0, 10 - uploadedFiles.length).map(async (file) => {
        const base64String = await fileToBase64(file)
        const { width, height } = await getImageDimensions(base64String)

        return {
          file: base64String,
          originalPreview: base64String,
          preview: base64String,
          aspectRatio: 'original' as const,
          croppedAreaPixels: {
            x: 0,
            y: 0,
            width,
            height,
          },
          zoom: 1,
        }
      }),
    )

    setUploadedFiles((prev) => [...prev, ...newFiles])

    if (rejectedFiles.length > 0) {
      setDropError(dropErrorSnackBar(rejectedFiles))
    }

    if (acceptedFiles.length > 0) {
      setPendingStepChange(true)
    }
  }

  const changeNextStep = async () => {
    switch (step) {
      case 'add':
        setStep('crop')
        break
      case 'crop':
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
          setStep('filter')
        } catch (error) {
          console.error('Error cropping images:', error)
          setStep('filter')
        }
        break
      case 'filter':
        setStep('publication')
        break
    }
  }

  const changePrevStep = () => {
    switch (step) {
      case 'publication':
        setStep('filter')
        break
      case 'filter':
        setUploadedFiles((prev) =>
          prev.map((file) => ({
            ...file,
            preview: file.originalPreview,
          })),
        )
        setStep('crop')
        break
      case 'crop':
        resetState()
        setStep('add')
        break
    }
  }

  const resetState = () => {
    setUploadedFiles([])
    setCurrentImageIndex(0)
    setDropError(null)
    reset({ description: '' })
  }

  const onFormSubmit = async (data: PublicationFormData) => {
    try {
      setIsLoadingStatus(true)
      const res = await createPost(data).unwrap()
      const id = res.id

      const imageFiles = await Promise.all(
        uploadedFiles.map(async (item) => {
          const imageData = item.filteredImage?.file || item.croppedImage || item.file
          return await base64ToFile(imageData, `image-${Date.now()}.jpg`)
        }),
      )

      if (imageFiles.length > 0) {
        console.log(imageFiles)
        await uploadImages({ postId: id, images: imageFiles }).unwrap()
      }

      resetState()
      onModalClose()
      setIsLoadingStatus(false)
    } catch (error) {
      setIsLoadingStatus(false)

      console.log('Error creating post:', error)
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]

  useEffect(() => {
    if (pendingStepChange && uploadedFiles.length > 0) {
      setStep('crop')
      setPendingStepChange(false)
    }
  }, [uploadedFiles, pendingStepChange])

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        resetState()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  return (
    <div className={s.wrapper}>
      {step === 'add' && (
        <AddStep
          isModalOpen={isModalOpen}
          onModalClose={onModalClose}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          dropError={dropError}
        />
      )}

      {step === 'crop' && (
        <CropStep
          isModalOpen={isModalOpen}
          onModalClose={onModalClose}
          onOverlayClick={openModal}
          changeNextStep={changeNextStep}
          changePrevStep={changePrevStep}
          uploadedFiles={uploadedFiles}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          setUploadedFiles={setUploadedFiles}
        />
      )}

      {step === 'filter' && (
        <FilterStep
          isModalOpen={isModalOpen}
          onModalClose={onModalClose}
          onOverlayClick={openModal}
          changeNextStep={changeNextStep}
          changePrevStep={changePrevStep}
          uploadedFiles={uploadedFiles}
          currentImage={currentImage}
          setUploadedFiles={setUploadedFiles}
        />
      )}

      {step === 'publication' && (
        <PublicationStep
          isModalOpen={isModalOpen}
          onModalClose={onModalClose}
          onOverlayClick={openModal}
          changePrevStep={changePrevStep}
          uploadedFiles={uploadedFiles}
          currentImageIndex={currentImageIndex}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onFormSubmit={onFormSubmit}
          isLoadingStatus={isLoadingStatus}
        />
      )}

      <ConfirmCloseModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => {
          closeModal()
          resetState()
          onModalClose()
        }}
      />
    </div>
  )
}
