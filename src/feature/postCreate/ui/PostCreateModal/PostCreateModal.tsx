import s from './PostCreateModal.module.scss'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { ImageCropper } from '@/src/shared/components/ImageCropper/ImageCropper'
import { FilterPanel } from '@/src/shared/components/FilterPanel/FilterPanel'
import Image from 'next/image'

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

const FILES_VALIDATE = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
  formats: ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
} as const

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  console.log(uploadedFiles)

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

  const handleCropComplete = (croppedImage: string) => {
    setUploadedFiles((prev) =>
      prev.map((file, index) => (index === currentImageIndex ? { ...file, croppedImage } : file)),
    )
    console.log(uploadedFiles)
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

  const handleNext = () => {
    if (step === 'add' && uploadedFiles.length > 0) {
      setStep('crop')
    } else if (step === 'crop') {
      setStep('filter')
    } else if (step === 'filter') {
      if (currentImageIndex < uploadedFiles.length - 1) {
        setCurrentImageIndex((prev) => prev + 1)
        setStep('crop')
      } else {
        setStep('publication')
      }
    }
  }

  const handleBack = () => {
    if (step === 'crop') {
      if (currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1)
      } else {
        setStep('add')
      }
    } else if (step === 'filter') {
      setStep('crop')
    } else if (step === 'publication') {
      setStep('filter')
    }
  }

  const changeNextStep = () => {
    switch (step) {
      case 'add':
        setStep('crop')
        break
      case 'crop':
        setStep('filter')
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
        setStep('crop')
        break
      case 'crop':
        setStep('add')
        break
    }
  }

  const currentImage = uploadedFiles[currentImageIndex]

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
          <ImageCropper image={currentImage.preview} onCropComplete={handleCropComplete} />
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
                image={currentImage.croppedImage || currentImage.preview}
                onFilterApply={handleFilterApply}
                currentFilter={currentImage.filter?.split('-')[0]} // Извлекаем только название фильтра
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
            <Button tagType={'button'} variant={'text'} withoutPadding onClick={changeNextStep}>
              Publish
            </Button>
          }
        >
          <div className={s.publication}>
            <div className={s.publicationWrapper}>
              <div className={s.publicationImg}>
                <Image src={currentImage.filteredImage?.preview || ''} alt={'Download img'} width={400} height={400} />
              </div>
              <div className={s.publicationContent}></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
