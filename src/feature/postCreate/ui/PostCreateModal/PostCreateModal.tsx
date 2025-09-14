import s from './PostCreateModal.module.scss'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
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
  filter?: string
}

const FILES_VALIDATE = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
  formats: ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
} as const

export const PostCreateModal = ({ isModalOpen, onModalClose }: Props) => {
  const [step, setStep] = useState<Steps>('add')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  console.log(uploadedFiles)

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 10 - uploadedFiles.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
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

  const changeNextStep = () => {
    debugger
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

  return (
    <div className={s.wrapper}>
      {step === 'add' && (
        <Modal isOpen={isModalOpen} onClose={onModalClose} modalTitle={'Add Photo'} hideDefaultButton>
          <div className={s.addStep}>
            <div {...getRootProps()} className={`${s.dropzone} ${isDragActive ? s.active : ''}`}>
              <input {...getInputProps()} />
              <div className={s.dropzoneContent}>
                <p>Drag photos here or click to select</p>
                <span className={s.fileInfo}>Up to 10 photos, max 10MB each</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {step === 'crop' && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          modalTitle={'Cropping'}
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
          {uploadedFiles.length > 0 && (
            <div className={s.uploadedFiles}>
              <h3>Selected photos ({uploadedFiles.length}/10)</h3>
              <div className={s.thumbnails}>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className={s.thumbnail}>
                    <Image
                      src={file.preview}
                      alt={`Preview ${index}`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
      {step === 'filter' && <Modal isOpen={isModalOpen} onClose={onModalClose} modalTitle={'Filters'}></Modal>}
      {step === 'publication' && <Modal isOpen={isModalOpen} onClose={onModalClose} modalTitle={'Publication'}></Modal>}
    </div>
  )
}
