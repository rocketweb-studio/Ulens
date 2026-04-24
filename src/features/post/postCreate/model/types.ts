import { Area } from 'react-easy-crop'
import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'

export type Steps = 'add' | 'crop' | 'filter' | 'publication'

export type UploadedFile = {
  file: string
  originalPreview: string
  preview: string
  aspectRatio: 'original' | '1:1' | '4:5' | '16:9'
  croppedAreaPixels?: Area
  croppedImage?: string
  filteredImage?: FilteredImage
  filter?: string
  zoom?: number
  cropPosition?: { x: number; y: number }
}

export type FilteredImage = {
  file: string
  filter: string
  preview: string
  intensity: number
  originalImage: string
}

export type PublicationFormData = {
  description: string
}

export type FilterPanelHandle = {
  applyFilter: () => void
}

export type Filter = {
  name: string
  value: string
  cssFilter: string
  preview: string
}

export type ImageFilters = {
  [imageIndex: number]: string
}

export type PostDraft = {
  id: string
  step: Steps
  uploadedFiles: UploadedFile[]
  currentImageIndex: number
  description: string
  createdAt: number
  updatedAt: number
}