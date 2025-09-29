import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCreatePostMutation, useUploadPostImagesMutation } from '@/src/feature/Posts/api/postsApi'
import { getCroppedImg } from '@/src/shared/components/ImageCropper/ImageCropper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/src/shared/hooks/useModal'
import { Steps, UploadedFile } from '@/src/feature/postCreate/types/types'
import { FILES_VALIDATE } from '../../consts/consts'
import { publicationSchema } from '../../model/schemas'
import { dropErrorSnackBar } from '@/src/feature/postCreate/utils'
import { AddStep } from './AddStep'
import { CropStep } from './CropStep'
import { FilterStep } from './FilterStep'
import { PublicationStep } from './PublicationStep'
import { ConfirmCloseModal } from './ConfirmCloseModal'
import s from './PostCreateModal.module.scss'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
}

type PublicationFormData = z.infer<typeof publicationSchema>

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [createPost] = useCreatePostMutation()
  const [uploadImages] = useUploadPostImagesMutation()
  const { isOpen, openModal, closeModal } = useModal()
  const [dropError, setDropError] = useState<string | null>(null)

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
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: { description: '' },
  })

  function onDrop(acceptedFiles: File[], rejectedFiles: any[]) {
    setDropError(null)
    const newFiles = acceptedFiles.slice(0, 10 - uploadedFiles.length).map((file) => ({
      file,
      originalPreview: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
      aspectRatio: 'original' as const,
    }))
    setUploadedFiles(newFiles)

    if (rejectedFiles.length > 0) {
      setDropError(dropErrorSnackBar(rejectedFiles))
    }

    if (acceptedFiles.length > 0) {
      changeNextStep()
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
        setStep('add')
        break
    }
  }

  const onFormSubmit = async (data: PublicationFormData) => {
    try {
      const res = await createPost(data).unwrap()
      const id = res.id
      const images = uploadedFiles.map((item) => item?.filteredImage?.file || null).filter((item) => item != null)
      await uploadImages({ postId: id, images }).unwrap()
      onModalClose()
    } catch (error) {
      console.log(error)
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]

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
        />
      )}

      <ConfirmCloseModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => {
          closeModal()
          onModalClose()
        }}
      />
    </div>
  )
}
