'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ImageNext from 'next/image'
import s from './FilterPanel.module.scss'
import {
  FilteredImage,
  FilterPanelHandle,
  ImageFilters,
  UploadedFile,
} from '@/src/features/post/postCreate/model/types'
import { createOriginalImageData } from '@/src/features/post/postCreate/utils'
import { TSlide } from '@/src/shared/ui/CustomSwiper/types'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'
import { FILTERS } from '@/src/features/post/postCreate/model/consts'

type Props = {
  onFilterApply: (filteredData: FilteredImage, indexActiveSlide: number) => void
  currentFilter?: string
  slides?: TSlide[]
  uploadedFiles: UploadedFile[]
}

export const FilterPanel = forwardRef<FilterPanelHandle, Props>(
  ({ onFilterApply, currentFilter = 'original', uploadedFiles }, ref) => {
    const [imageFilters, setImageFilters] = useState<ImageFilters>(() => {
      const initialFilters: ImageFilters = {}
      uploadedFiles.forEach((_, index) => {
        initialFilters[index] = currentFilter
      })
      return initialFilters
    })

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const hasAppliedInitialFiltersRef = useRef(false)

    const currentImage = uploadedFiles[currentImageIndex]
    const image = currentImage?.croppedImage || currentImage?.preview

    const selectedFilter = imageFilters[currentImageIndex] || currentFilter

    const applyFilterToImage = useCallback(async (filterValue: string, imageForFilter: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas context not available')

          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = imageForFilter

          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })

          canvas.width = img.width
          canvas.height = img.height

          ctx.filter = getCssFilterValue(filterValue, 100)
          ctx.drawImage(img, 0, 0)

          const filteredBase64 = canvas.toDataURL('image/jpeg', 0.9)
          resolve(filteredBase64)
        } catch (error) {
          reject(error)
        }
      })
    }, [])

    const handleFilterSelect = async (filterValue: string) => {
      setImageFilters((prev) => ({
        ...prev,
        [currentImageIndex]: filterValue,
      }))

      try {
        if (filterValue === 'original') {
          const originalData = await createOriginalImageData(image)

          onFilterApply(
            {
              file: originalData,
              filter: 'original',
              preview: originalData,
              intensity: 100,
              originalImage: image,
            },
            currentImageIndex,
          )
        } else {
          const filteredBase64 = await applyFilterToImage(filterValue, image)

          onFilterApply(
            {
              file: filteredBase64,
              filter: filterValue,
              preview: filteredBase64,
              intensity: 100,
              originalImage: image,
            },
            currentImageIndex,
          )
        }
      } catch (error) {
        console.error('Error applying filter:', error)
      }
    }

    const handleApplyFilter = async () => {
      await handleFilterSelect(selectedFilter)
    }

    useImperativeHandle(
      ref,
      () => ({
        applyFilter: handleApplyFilter,
      }),
      [handleApplyFilter],
    )

    const getCssFilterValue = (filterValue: string, intensityValue: number): string => {
      if (filterValue === 'original') return 'none'

      const filter = FILTERS.find((f) => f.value === filterValue)
      if (!filter) return 'none'

      return filter.cssFilter
    }

    const getFilterStyle = (filterValue: string) => {
      if (filterValue === 'original') return {}

      const filter = FILTERS.find((f) => f.value === filterValue)
      if (!filter) return {}

      return { filter: filter.cssFilter }
    }

    const createFilterSlides = (files: UploadedFile[]) =>
      files.map((file, index) => {
        const slideFilter = imageFilters[index] || currentFilter

        return {
          id: index,
          content: (
            <div className={s.slideContent}>
              <ImageNext
                src={file.croppedImage || file.preview}
                alt='Filter preview'
                width={490}
                height={530}
                style={{
                  ...getFilterStyle(slideFilter),
                }}
                className={s.previewImage}
              />
            </div>
          ),
        }
      })

    const handleSlideChange = (swiper: any) => {
      setCurrentImageIndex(swiper.activeIndex)
    }

    const slides = createFilterSlides(uploadedFiles)

    useEffect(() => {
      const applyInitialFilters = async () => {
        if (!hasAppliedInitialFiltersRef.current && uploadedFiles.length > 0) {
          hasAppliedInitialFiltersRef.current = true

          for (let i = 0; i < uploadedFiles.length; i++) {
            const imageUrl = uploadedFiles[i].croppedImage || uploadedFiles[i].preview
            try {
              const originalData = await createOriginalImageData(imageUrl)

              onFilterApply(
                {
                  file: originalData,
                  filter: 'original',
                  preview: originalData,
                  intensity: 100,
                  originalImage: imageUrl,
                },
                i,
              )
            } catch (error) {
              console.error('Error applying initial filter:', error)
            }
          }
        }
      }

      applyInitialFilters()
    }, [uploadedFiles, onFilterApply])

    return (
      <div className={s.filterPanel}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className={s.preview}>
          <div className={s.mainPreview}>
            <CustomSwiper slides={slides || []} className={s.customSwiper} onSlideChange={handleSlideChange} />
          </div>
        </div>

        <div className={s.filterControls}>
          <div className={s.filterList}>
            <ul className={s.filterThumbnails}>
              {FILTERS.map((filter) => (
                <li
                  key={filter.value}
                  className={`${s.filterThumbnail} ${selectedFilter === filter.value ? s.active : ''}`}
                  onClick={() => handleFilterSelect(filter.value)}
                >
                  <div className={s.thumbnailImage}>
                    <ImageNext
                      src={currentImage?.preview || ''}
                      alt={filter.name}
                      width={60}
                      height={60}
                      style={{
                        objectFit: 'cover',
                        ...getFilterStyle(filter.value),
                      }}
                    />
                  </div>
                  <span className={s.filterName}>{filter.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  },
)
