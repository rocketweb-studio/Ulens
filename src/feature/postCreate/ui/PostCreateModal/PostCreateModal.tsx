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
  const [draftStep, setDraftStep] = useState<Steps | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })
  const filterPanelRef = useRef<{ applyFilter: () => void }>(null)
  const { isOpen, openModal, closeModal } = useModal()
  const [slides, setSlides] = useState<TSlide[]>([])

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
    createSlides(uploadedFiles)
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

  const createSlides = (files: UploadedFile[]) => {
    return setSlides(
      files.map((file, index) => ({
        id: index,
        content: (
          <div className={s.slideContent}>
            <ImageCropper
              image={file.preview}
              onCropComplete={handleCropComplete}
              onCropAreaChange={handleCropAreaChange}
              initialAspectRatio={'4:5'}
            />
          </div>
        ),
      })),
    )
  }

  const handleCropComplete = (croppedImage: string, areaPixels?: Area) => {
    setUploadedFiles((prev) =>
      prev.map((file, index) =>
        index === currentImageIndex ? { ...file, croppedImage, preview: croppedImage } : file,
      ),
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
          createSlides(uploadedFiles)
          setStep('filter')
        } catch (error) {
          console.error('Error cropping image:', error)
          setStep('filter')
        }
        break
      case 'filter':
        if (filterPanelRef.current) {
          await filterPanelRef.current.applyFilter()
          createSlides(uploadedFiles)
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

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      openModal()
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]

  const descriptionValue = watch('description', '')
  const characterCount = descriptionValue.length
  const onPublishHandler = () => {
    handleSubmit(onFormSubmit)()
    onModalClose()
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

  console.log(slides)
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
            slides={slides}
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
          {/*<ImageCropper*/}
          {/*  image={currentImage.preview}*/}
          {/*  onCropComplete={handleCropComplete}*/}
          {/*  onCropAreaChange={handleCropAreaChange}*/}
          {/*  initialAspectRatio={'4:5'}*/}
          {/*/>*/}
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
            image={currentImage.croppedImage || currentImage.preview}
            onFilterApply={handleFilterApply}
            currentFilter={currentImage.filter?.split('-')[0]}
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
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={onPublishHandler}>
              Publish
            </Button>
          }
        >
          <div className={s.publication}>
            <div className={s.publicationImgWrapper}>
              <div className={s.publicationImg}>
                <Image src={currentImage.filteredImage?.preview || ''} alt={'Download img'} width={400} height={400} />
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
