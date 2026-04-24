'use client'

import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/src/shared/hooks/useModal'
import { FILES_VALIDATE } from '../../model/consts'
import { publicationSchema } from '../../model/schemas'
import { base64ToFile, dropErrorSnackBar, fileToBase64, getImageDimensions, saveDraft, getDraft, deleteDraft, hasDraft } from '../../utils'
import { AddStep } from './AddStep'
import { CropStep } from './CropStep'
import { FilterStep } from './FilterStep'
import { PublicationStep } from './PublicationStep'
import { ConfirmCloseModal } from './ConfirmCloseModal'
import s from './PostCreateModal.module.scss'
import { useForm } from 'react-hook-form'
import { Steps, UploadedFile } from '@/src/features/post/postCreate/model/types'
import { useCreatePostMutation, useUploadPostImagesMutation } from '@/src/entities/post/api/postsApi'
import { getCroppedImg } from '@/src/features/post/postCreate/utils/getCroppedImage'

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
  const [draftExists, setDraftExists] = useState<boolean>(false)

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
    getValues,
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

  const resetState = async () => {
    setUploadedFiles([])
    setCurrentImageIndex(0)
    setDropError(null)
    reset({ description: '' })
    setStep('add')
    await deleteDraft()
    setDraftExists(false)
  }

  const loadDraft = async () => {
    try {
      const draft = await getDraft()
      if (draft) {
        setStep(draft.step)
        setUploadedFiles(draft.uploadedFiles)
        setCurrentImageIndex(draft.currentImageIndex)
        reset({ description: draft.description })
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }

  const handleSaveDraft = async () => {
    try {
      if (uploadedFiles.length > 0) {
        const formValues = getValues()
        await saveDraft(step, uploadedFiles, currentImageIndex, formValues.description || '')
        setDraftExists(true)
      }
      closeModal()
      onModalClose()
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const handleDiscard = async () => {
    await resetState()
    closeModal()
    onModalClose()
  }

  const handleOpenDraft = async () => {
    await loadDraft()
    // После загрузки черновика обновляем состояние
    // Черновик остается в IndexedDB, так как пользователь может снова сохранить его
  }

  const shouldShowConfirmModal = () => {
    return uploadedFiles.length > 0
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
        await uploadImages({ postId: id, images: imageFiles }).unwrap()
      }

      await resetState()
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
    if (isModalOpen) {
      hasDraft().then(setDraftExists)
    }
  }, [isModalOpen])

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        if (step === 'add' && uploadedFiles.length === 0) {
          resetState()
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  return (
    <div className={s.wrapper}>
      {step === 'add' && (
        <AddStep
          isModalOpen={isModalOpen}
          onModalClose={shouldShowConfirmModal() ? openModal : onModalClose}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          dropError={dropError}
          hasDraft={draftExists}
          onOpenDraft={handleOpenDraft}
        />
      )}

      {step === 'crop' && (
        <CropStep
          isModalOpen={isModalOpen}
          onModalClose={openModal}
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
          onModalClose={openModal}
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
          onModalClose={openModal}
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
        onClose={handleDiscard}
        onConfirm={handleDiscard}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  )
}
