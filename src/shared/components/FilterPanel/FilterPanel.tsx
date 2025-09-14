import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/shared/components/Button/Button'
import s from './FilterPanel.module.scss'

type Props = {
  image: string
  onFilterApply: (filter: string) => void
  currentFilter?: string
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

export const FilterPanel = ({ image, onFilterApply, currentFilter = 'original' }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(currentFilter)
  const [intensity, setIntensity] = useState<number>(100)

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue)
  }

  const handleIntensityChange = (value: number) => {
    setIntensity(value)
  }

  const handleApplyFilter = () => {
    if (selectedFilter === 'original') {
      onFilterApply('original')
    } else {
      onFilterApply(`${selectedFilter}-${intensity}`)
    }
  }

  const getFilterStyle = (filterValue: string, customIntensity?: number) => {
    if (filterValue === 'original') return {}

    const filter = filters.find((f) => f.value === filterValue)
    if (!filter) return {}

    const intensityValue = customIntensity !== undefined ? customIntensity : intensity
    const intensityMultiplier = intensityValue / 100

    if (intensityValue === 100) {
      return { filter: filter.cssFilter }
    }

    // Динамическое изменение интенсивности фильтра
    const cssFilter = filter.cssFilter
      .replace(/contrast\(([\d.]+)\)/g, (match, value) => {
        const newValue = 1 + (parseFloat(value) - 1) * intensityMultiplier
        return `contrast(${newValue.toFixed(2)})`
      })
      .replace(/saturate\(([\d.]+)\)/g, (match, value) => {
        const newValue = 1 + (parseFloat(value) - 1) * intensityMultiplier
        return `saturate(${newValue.toFixed(2)})`
      })
      .replace(/brightness\(([\d.]+)\)/g, (match, value) => {
        const newValue = 1 + (parseFloat(value) - 1) * intensityMultiplier
        return `brightness(${newValue.toFixed(2)})`
      })
      .replace(/sepia\(([\d.]+)\)/g, (match, value) => {
        const newValue = parseFloat(value) * intensityMultiplier
        return `sepia(${newValue.toFixed(2)})`
      })
      .replace(/grayscale\(([\d.]+)\)/g, (match, value) => {
        const newValue = parseFloat(value) * intensityMultiplier
        return `grayscale(${newValue.toFixed(2)})`
      })

    return { filter: cssFilter }
  }

  return (
    <div className={s.filterPanel}>
      <div className={s.preview}>
        <div className={s.mainPreview}>
          <Image
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
        {selectedFilter !== 'original' && (
          <div className={s.intensityControl}>
            <label>Intensity: {intensity}%</label>
            <input
              type='range'
              min='0'
              max='100'
              step='1'
              value={intensity}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className={s.intensitySlider}
            />
          </div>
        )}

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
                  <Image
                    src={image}
                    alt={filter.name}
                    width={60}
                    height={60}
                    style={{
                      objectFit: 'cover',
                      ...getFilterStyle(filter.value, 100),
                    }}
                  />
                </div>
                <span className={s.filterName}>{filter.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.actions}>
        <Button onClick={handleApplyFilter} className={s.applyButton}>
          Apply Filter
        </Button>
      </div>
    </div>
  )
}
