import s from './PostCreateModal.module.scss'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { MouseEvent, ReactNode, useCallback, useRef, useState } from 'react'
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
import { TextArea } from '@/src/shared/components/TextArea/TextArea'
import { useModal } from '@/src/shared/hooks/useModal'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'
import { TSlide } from '@/src/shared/components/CustomSwiper/types'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
}

type Steps = 'add' | 'crop' | 'filter' | 'publication'

export type UploadedFile = {
  file: File
  originalPreview: string // Сохраняем оригинальное превью
  preview: string // Текущее превью (может быть обрезанным)
  croppedImage?: string
  filteredImage?: FilteredImage
  filter?: string
  croppedAreaPixels?: Area
  aspectRatio?: 'original' | '1:1' | '4:5' | '16:9'
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

const FILES_VALIDATE = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
  formats: ['.jpeg', '.jpg', '.png'],
} as const

const publicationSchema = z.object({
  description: z
    .string()
    .min(10, { message: 'Must be more than 10 characters' })
    .max(500, { message: 'Must be more than 500 characters' }),
})

type PublicationFormData = z.infer<typeof publicationSchema>

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [createPost, { data: dataCreatePost }] = useCreatePostMutation()
  const [uploadImages] = useUploadPostImagesMutation()
  const [draftStep, setDraftStep] = useState<Steps | null>(null)
  const filterPanelRef = useRef<{ applyFilter: () => void }>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [dropError, setDropError] = useState<string | null>(null)

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

  const dropErrorSnackBar = (rejectedFiles: any[]): string => {
    const firstError = rejectedFiles[0].errors[0]

    let errorMessage = ''

    switch (firstError.code) {
      case 'file-too-large':
        errorMessage = `The photos must be less than: ${FILES_VALIDATE.maxSize / (1024 * 1024)}MB`
        break
      case 'file-invalid-type':
        errorMessage = `Invalid file format. Allowed formats: ${FILES_VALIDATE.formats.join(', ')}`
        break
      case 'too-many-files':
        errorMessage = `There are too many files. Maximum: ${FILES_VALIDATE.maxFiles}`
        break
      default:
        errorMessage = `Ошибка: ${firstError.message}`
    }

    return errorMessage
  }

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': FILES_VALIDATE.formats,
    },
    maxFiles: FILES_VALIDATE.maxFiles,
    maxSize: FILES_VALIDATE.maxSize,
  })

  // const resetToOriginalImage = useCallback((index: number) => {
  //   setUploadedFiles((prev) =>
  //     prev.map((file, i) =>
  //       i === index ?
  //         {
  //           ...file,
  //           preview: file.originalPreview,
  //         }
  //       : file,
  //     ),
  //   )
  // }, [])

  const handleAspectRatioChange = useCallback(
    (aspectRatio: 'original' | '1:1' | '4:5' | '16:9', index?: number) => {
      const targetIndex = index !== undefined ? index : currentImageIndex

      setUploadedFiles((prev) => prev.map((file, i) => (i === targetIndex ? { ...file, aspectRatio } : file)))
    },
    [currentImageIndex],
  )

  const createCropSlides = (files: UploadedFile[]): TSlide[] =>
    files.map((file, index) => ({
      id: index,
      content: (
        <div className={s.slideContent}>
          <ImageCropper
            image={file.preview}
            onCropComplete={(croppedImage, areaPixels) => handleCropComplete(croppedImage, areaPixels, index)}
            onCropAreaChange={(areaPixels) => handleCropAreaChange(areaPixels, index)}
            onAspectRatioChange={(aspectRatio) => handleAspectRatioChange(aspectRatio, index)}
            initialAspectRatio={file.aspectRatio || 'original'}
            isActiveSlide={index === currentImageIndex}
          />
        </div>
      ),
    }))

  const createPublicationSlides = (files: UploadedFile[]): TSlide[] =>
    files.map((file, index) => ({
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

  const handleCropComplete = (croppedImage: string, areaPixels?: Area, index?: number) => {
    const targetIndex = index !== undefined ? index : currentImageIndex

    setUploadedFiles((prev) =>
      prev.map((file, i) =>
        i === targetIndex ?
          {
            ...file,
            croppedImage,
            preview: croppedImage,
            croppedAreaPixels: areaPixels,
          }
        : file,
      ),
    )
  }

  const handleCropAreaChange = (areaPixels: Area, index?: number) => {
    const targetIndex = index !== undefined ? index : currentImageIndex

    setUploadedFiles((prev) =>
      prev.map((file, i) => (i === targetIndex ? { ...file, croppedAreaPixels: areaPixels } : file)),
    )
  }

  const handleFilterApply = useCallback(
    (filteredData: FilteredImage, indexActiveSlide: number) => {
      setUploadedFiles((prev) =>
        prev.map((file, index) =>
          index === indexActiveSlide ?
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
          const cropPromises = uploadedFiles.map(async (file, index) => {
            if (file.croppedAreaPixels && file.croppedAreaPixels.width > 0 && file.croppedAreaPixels.height > 0) {
              const croppedImage = await getCroppedImg(file.originalPreview, file.croppedAreaPixels) // Используем оригинал для обрезки
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

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      openModal()
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]
  const cropSlides = createCropSlides(uploadedFiles)
  const publicationSlides = createPublicationSlides(uploadedFiles)

  const handleSlideChange = (swiper: any) => {
    setCurrentImageIndex(swiper.activeIndex)
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
      onModalClose()
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
            {dropError && (
              <div className={s.dropError}>
                <p className={s.dropErrorText}>{dropError}</p>
              </div>
            )}
          </div>
          {draftStep && <Button variant={'primary'}>OpenDraft</Button>}
        </Modal>
      )}
      {step === 'crop' && (
        <Modal
          className={`${s.modal} ${s.cropModal}`}
          isOpen={isModalOpen}
          onClose={onModalClose}
          onOverlayClick={onOverlayClick}
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
      )}
      {step === 'filter' && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onOverlayClick={onOverlayClick}
          modalTitle={'Filters'}
          hideCloseButton
          hideDefaultButton
          withoutPadding
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
          <FilterPanel
            ref={filterPanelRef}
            onFilterApply={handleFilterApply}
            currentFilter={currentImage?.filter?.split('-')[0]}
            uploadedFiles={uploadedFiles}
          />
        </Modal>
      )}
      {step === 'publication' && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onOverlayClick={onOverlayClick}
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
                  navigation={true}
                  pagination={true}
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
      )}
      <Modal isOpen={isOpen} onClose={closeModal} modalTitle={'Сlose'} hideDefaultButton>
        <p className={s.accessCloseModalText}>
          Do you really want to close the creation of a publication? If you close everything will be deleted
        </p>
        <div className={s.accessCloseModalButtons}>
          <Button variant={'outline'} onClick={closeModal}>
            Discard
          </Button>
          <Button
            variant={'primary'}
            onClick={() => {
              closeModal()
              onModalClose()
            }}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  )
}
