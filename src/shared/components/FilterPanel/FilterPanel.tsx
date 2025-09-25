import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import ImageNext from 'next/image'
import s from './FilterPanel.module.scss'
import { FilteredImage, UploadedFile } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'
import { TSlide } from '@/src/shared/components/CustomSwiper/types'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'

type Props = {
  onFilterApply: (filteredData: FilteredImage, indexActiveSlide: number) => void
  currentFilter?: string
  slides?: TSlide[]
  uploadedFiles: UploadedFile[]
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

export const filters: Filter[] = [
  {
    name: 'Original',
    value: 'original',
    cssFilter: 'none',
    preview: 'Original',
  },
  {
    name: 'Clarendon',
    value: 'clarendon',
    cssFilter: 'contrast(1.2) saturate(1.3)',
    preview: 'C',
  },
  {
    name: 'Juno',
    value: 'juno',
    cssFilter: 'sepia(0.3) hue-rotate(-20deg) saturate(1.4)',
    preview: 'J',
  },
  {
    name: 'Lark',
    value: 'lark',
    cssFilter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
    preview: 'L',
  },
  {
    name: 'Moon',
    value: 'moon',
    cssFilter: 'grayscale(1) contrast(1.1) brightness(1.1)',
    preview: 'M',
  },
  {
    name: 'Reyes',
    value: 'reyes',
    cssFilter: 'sepia(0.4) contrast(0.9) brightness(1.1)',
    preview: 'R',
  },
  {
    name: 'Slumber',
    value: 'slumber',
    cssFilter: 'contrast(1.1) saturate(1.1) hue-rotate(350deg)',
    preview: 'S',
  },
  {
    name: 'Valencia',
    value: 'valencia',
    cssFilter: 'contrast(1.1) brightness(1.1) sepia(0.1)',
    preview: 'V',
  },
  {
    name: 'Walden',
    value: 'walden',
    cssFilter: 'sepia(0.3) hue-rotate(350deg) saturate(1.6)',
    preview: 'W',
  },
]

type ImageFilters = {
  [imageIndex: number]: string
}

// Функция для создания файла с оригинальным изображением
const createOriginalFile = async (imageUrl: string): Promise<File> => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  return new File([blob], `original-${Date.now()}.jpg`, { type: 'image/jpeg' })
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
    const image = currentImage.croppedImage || currentImage.preview

    const selectedFilter = imageFilters[currentImageIndex] || currentFilter

    const applyFilterToImage = useCallback(async (filterValue: string, imageForFilter: string): Promise<Blob> => {
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

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to create blob'))
              }
            },
            'image/jpeg',
            0.9,
          )
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
          const file = await createOriginalFile(image)
          const preview = URL.createObjectURL(file)

          onFilterApply(
            {
              file,
              filter: 'original',
              preview,
              intensity: 100,
              originalImage: image,
            },
            currentImageIndex,
          )
        } else {
          const filteredBlob = await applyFilterToImage(filterValue, image)
          const fileName = `filtered-${filterValue}-${Date.now()}.jpg`
          const filteredFile = new File([filteredBlob], fileName, { type: 'image/jpeg' })
          const preview = URL.createObjectURL(filteredFile)

          onFilterApply(
            {
              file: filteredFile,
              filter: filterValue,
              preview,
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
      if (!hasAppliedInitialFiltersRef.current) {
        hasAppliedInitialFiltersRef.current = true

        for (let i = 0; i < uploadedFiles.length; i++) {
          const imageUrl = uploadedFiles[i].croppedImage || uploadedFiles[i].preview
          const file = await createOriginalFile(imageUrl)
          const preview = URL.createObjectURL(file)

          onFilterApply(
            {
              file,
              filter: 'original',
              preview,
              intensity: 100,
              originalImage: imageUrl,
            },
            i,
          )
        }
      } else {
        await handleFilterSelect(selectedFilter)
      }
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

      const filter = filters.find((f) => f.value === filterValue)
      if (!filter) return 'none'

      return filter.cssFilter
    }

    const getFilterStyle = (filterValue: string) => {
      if (filterValue === 'original') return {}

      const filter = filters.find((f) => f.value === filterValue)
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

    return (
      <div className={s.filterPanel}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className={s.preview}>
          <div className={s.mainPreview}>
            <CustomSwiper
              slides={slides || []}
              navigation={true}
              pagination={true}
              className={s.customSwiper}
              allowTouchMove={false}
              onSlideChange={handleSlideChange}
              swiperProps={{
                spaceBetween: 0,
                slidesPerView: 1,
                noSwiping: true,
                noSwipingClass: 'swiper-slide',
                preventInteractionOnTransition: true,
              }}
            />
          </div>
        </div>

        <div className={s.filterControls}>
          <div className={s.filterList}>
            <ul className={s.filterThumbnails}>
              {filters.map((filter) => (
                <li
                  key={filter.value}
                  className={`${s.filterThumbnail} ${selectedFilter === filter.value ? s.active : ''}`}
                  onClick={() => handleFilterSelect(filter.value)}
                >
                  <div className={s.thumbnailImage}>
                    <ImageNext
                      src={currentImage.preview}
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
