import { Area } from 'react-easy-crop'

export type Steps = 'add' | 'crop' | 'filter' | 'publication'

export type UploadedFile = {
  file: File
  originalPreview: string
  preview: string
  aspectRatio: 'original' | '1:1' | '4:5' | '16:9'
  croppedAreaPixels?: Area
  croppedImage?: string
  filteredImage?: FilteredImage
  filter?: string
}

export type FilteredImage = {
  file: File
  filter: string
  preview: string
  intensity: number
  originalImage: string
}

import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'

export type PublicationFormData = {
  description: string
}

export type StepProps = {
  isModalOpen: boolean
  onModalClose: () => void
  onOverlayClick?: () => void
}

export type CropStepProps = StepProps & {
  changeNextStep: () => void
  changePrevStep: () => void
  uploadedFiles: UploadedFile[]
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
  setUploadedFiles: (files: UploadedFile[]) => void
}

export type PublicationStepProps = StepProps & {
  changePrevStep: () => void
  uploadedFiles: UploadedFile[]
  currentImageIndex: number
  control: Control<PublicationFormData>
  errors: FieldErrors<PublicationFormData>
  handleSubmit: UseFormHandleSubmit<PublicationFormData>
  onFormSubmit: (data: PublicationFormData) => void
}
