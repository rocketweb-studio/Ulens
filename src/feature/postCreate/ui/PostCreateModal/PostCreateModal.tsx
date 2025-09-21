import s from './PostCreateModal.module.scss'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { getCroppedImg, ImageCropper } from '@/src/shared/components/ImageCropper/ImageCropper'
import { FilterPanel } from '@/src/shared/components/FilterPanel/FilterPanel'
import Image from 'next/image'
import { useCreatePostMutation, useUploadPostImagesMutation } from '@/src/feature/Posts/api/postsApi'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Area } from 'react-easy-crop'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
}

type Steps = 'add' | 'crop' | 'filter' | 'publication'

type UploadedFile = {
  file: File
  preview: string
  croppedImage?: string
  filteredImage?: FilteredImage
  filter?: string
}

export type Filter = {
  name: string
  value: string
  cssFilter: string
  preview: string
}

export type FilteredImage = {
  file: File
  filter: string
  preview: string
  intensity: number
  originalImage: string
}

export type FormData = {
  description: string
}

const FILES_VALIDATE = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
  formats: ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
} as const

const publicationSchema = z.object({
  description: z
    .string()
    .min(10, { message: 'Описание должно содержать минимум 10 символов' })
    .max(500, { message: 'Описание не может превышать 500 символов' }),
})

type PublicationFormData = z.infer<typeof publicationSchema>

type PublicationTextareaProps = {
  onSubmit: (data: PublicationFormData) => void
}

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [createPost, { data: dataCreatePost }] = useCreatePostMutation()
  const [uploadImages] = useUploadPostImagesMutation()
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })
  const filterPanelRef = useRef<{ applyFilter: () => void }>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      description: '',
    },
  })

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 10 - uploadedFiles.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setUploadedFiles(newFiles)
    changeNextStep()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': FILES_VALIDATE.formats,
    },
    maxFiles: FILES_VALIDATE.maxFiles,
    maxSize: FILES_VALIDATE.maxSize,
  })

  const handleCropComplete = (croppedImage: string, areaPixels?: Area) => {
    setUploadedFiles((prev) =>
      prev.map((file, index) => (index === currentImageIndex ? { ...file, croppedImage } : file)),
    )
    if (areaPixels) {
      setCroppedAreaPixels(areaPixels)
    }
  }

  const handleCropAreaChange = (areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }

  const handleFilterApply = useCallback(
    (filteredData: FilteredImage) => {
      setUploadedFiles((prev) =>
        prev.map((file, index) =>
          index === currentImageIndex ?
            {
              ...file,
              filteredImage: filteredData,
              filter: `${filteredData.filter}-${filteredData.intensity}`,
            }
          : file,
        ),
      )
    },
    [currentImageIndex],
  )

  const changeNextStep = async () => {
    switch (step) {
      case 'add':
        setStep('crop')
        break
      case 'crop':
        try {
          const croppedImage = await getCroppedImg(currentImage.preview, croppedAreaPixels)
          handleCropComplete(croppedImage)
          setStep('filter')
        } catch (error) {
          console.error('Error cropping image:', error)
          setStep('filter')
        }
        break
      case 'filter':
        // Вызываем применение фильтра перед переходом
        if (filterPanelRef.current) {
          await filterPanelRef.current.applyFilter()
        }
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
        setStep('crop')
        break
      case 'crop':
        setStep('add')
        break
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]

  const descriptionValue = watch('description', '')
  const characterCount = descriptionValue.length
  const onPublishHandler = () => {
    handleSubmit(onFormSubmit)()
  }

  const onFormSubmit: SubmitHandler<PublicationFormData> = async (data) => {
    try {
      const res = await createPost(data).unwrap()
      const id = res.id
      const images = uploadedFiles
        .map((item) => {
          if (item?.filteredImage?.file) {
            return item.filteredImage.file
          } else {
            return null
          }
        })
        .filter((item) => item != null)
      await uploadImages({ postId: id, images }).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={s.wrapper}>
      {step === 'add' && (
        <Modal
          className={s.modal}
          isOpen={isModalOpen}
          onClose={onModalClose}
          modalTitle={'Add Photo'}
          hideDefaultButton
        >
          <div className={s.addStep}>
            <div {...getRootProps()} className={`${s.dropzone} ${isDragActive ? s.active : ''}`}>
              <input {...getInputProps()} />
              <div className={s.dropzoneContent}>
                <Button variant={'primary'}>Select from Computer</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {step === 'crop' && (
        <Modal
          className={`${s.modal} ${s.cropModal}`}
          isOpen={isModalOpen}
          onClose={onModalClose}
          modalTitle={'Cropping'}
          withoutPadding
          hideCloseButton
          hideDefaultButton
          buttonRightInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changeNextStep}>
              Next
            </Button>
          }
          buttonLeftInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
              <IconArrowIosBackOutline />
            </Button>
          }
        >
          <ImageCropper
            image={currentImage.preview}
            onCropComplete={handleCropComplete}
            onCropAreaChange={handleCropAreaChange}
          />
        </Modal>
      )}
      {step === 'filter' && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          modalTitle={'Filters'}
          hideCloseButton
          hideDefaultButton
          buttonRightInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changeNextStep}>
              Next
            </Button>
          }
          buttonLeftInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
              <IconArrowIosBackOutline />
            </Button>
          }
        >
          <div>
            <div className={s.filterStep}>
              <FilterPanel
                ref={filterPanelRef}
                image={currentImage.croppedImage || currentImage.preview}
                onFilterApply={handleFilterApply}
                currentFilter={currentImage.filter?.split('-')[0]}
              />
            </div>
          </div>
        </Modal>
      )}
      {step === 'publication' && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          modalTitle={'Publication'}
          hideCloseButton
          hideDefaultButton
          buttonLeftInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
              <IconArrowIosBackOutline />
            </Button>
          }
          buttonRightInModalHeader={
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={onPublishHandler}>
              Publish
            </Button>
          }
        >
          <div className={s.publication}>
            <div className={s.publicationWrapper}>
              <div className={s.publicationImg}>
                <Image src={currentImage.filteredImage?.preview || ''} alt={'Download img'} width={400} height={400} />
              </div>
              <div className={s.publicationContent}>
                <form onSubmit={handleSubmit(onFormSubmit)} className={s.form}>
                  <div className={s.container}>
                    <label htmlFor='description' className={s.label}>
                      Описание публикации
                    </label>

                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id='description'
                          className={`${s.textarea} ${errors.description ? s.error : ''}`}
                          placeholder='Add publication descriptions'
                          rows={5}
                        />
                      )}
                    />

                    <div className={s.footer}>
                      {errors.description && <span className={s.errorMessage}>{errors.description.message}</span>}
                      <div className={s.counter}>{characterCount}/500</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
