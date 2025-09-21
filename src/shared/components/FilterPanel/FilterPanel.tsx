import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import ImageNext from 'next/image'
import s from './FilterPanel.module.scss'
import { FilteredImage } from '@/src/feature/postCreate/ui/PostCreateModal/PostCreateModal'

type Props = {
  image: string
  onFilterApply: (filteredData: FilteredImage) => void
  currentFilter?: string
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
  {
    name: 'X-Pro II',
    value: 'xpro2',
    cssFilter: 'contrast(1.3) sepia(0.3)',
    preview: 'X',
  },
]

export const FilterPanel = forwardRef<FilterPanelHandle, Props>(
  ({ image, onFilterApply, currentFilter = 'original' }, ref) => {
    const [selectedFilter, setSelectedFilter] = useState<string>(currentFilter)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const applyFilterToImage = useCallback(async (): Promise<Blob> => {
      return new Promise(async (resolve, reject) => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas context not available')

          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = image

          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })

          canvas.width = img.width
          canvas.height = img.height

          // Применяем фильтр с фиксированной интенсивностью 100%
          ctx.filter = getCssFilterValue(selectedFilter, 100)
          ctx.drawImage(img, 0, 0)

          // Конвертируем в Blob
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
    }, [image, selectedFilter])

    const handleFilterSelect = (filterValue: string) => {
      setSelectedFilter(filterValue)
    }

    const handleApplyFilter = async () => {
      try {
        if (selectedFilter === 'original') {
          const response = await fetch(image)
          const blob = await response.blob()
          const file = new File([blob], `original-${Date.now()}.jpg`, { type: 'image/jpeg' })
          const preview = URL.createObjectURL(file)

          onFilterApply({
            file,
            filter: 'original',
            preview,
            intensity: 100,
            originalImage: image,
          })
        } else {
          const filteredBlob = await applyFilterToImage()
          const fileName = `filtered-${selectedFilter}-${Date.now()}.jpg`
          const filteredFile = new File([filteredBlob], fileName, { type: 'image/jpeg' })
          const preview = URL.createObjectURL(filteredFile)

          onFilterApply({
            file: filteredFile,
            filter: selectedFilter,
            preview,
            intensity: 100,
            originalImage: image,
          })
        }
      } catch (error) {
        console.error('Error applying filter:', error)
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

    return (
      <div className={s.filterPanel}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className={s.preview}>
          <div className={s.mainPreview}>
            <ImageNext
              src={image}
              alt='Filter preview'
              width={400}
              height={400}
              style={{
                objectFit: 'contain',
                ...getFilterStyle(selectedFilter),
              }}
              className={s.previewImage}
            />
          </div>
        </div>

        <div className={s.filterControls}>
          <div className={s.filterList}>
            <h4>Filters</h4>
            <div className={s.filterThumbnails}>
              {filters.map((filter) => (
                <div
                  key={filter.value}
                  className={`${s.filterThumbnail} ${selectedFilter === filter.value ? s.active : ''}`}
                  onClick={() => handleFilterSelect(filter.value)}
                >
                  <div className={s.thumbnailImage}>
                    <ImageNext
                      src={image}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
)
