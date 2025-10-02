'use client'

import { ComponentType, useEffect, useState } from 'react'
import { Area } from 'react-easy-crop'
import { Button } from '@/src/shared/components/Button/Button'
import s from './ImageCropper.module.scss'
import { IconExpandOutline, IconMaximizeOutline } from '@rocketweb-studio/ulens-ui-kit'
import ImageNext from 'next/image'
import { createImage } from '@/src/shared/components/ImageCropper/model'
import dynamic from 'next/dynamic'

const Cropper = dynamic(() => import('react-easy-crop').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className={s.loading}>Loading cropper...</div>,
}) as ComponentType<any>

type Props = {
  image: string
  initialAspectRatio?: AspectRatio
  onCropAreaChange?: (areaPixels: Area) => void
  isActiveSlide?: boolean
  onAspectRatioChange?: (aspectRatio: AspectRatio) => void
}

export type AspectRatio = '1:1' | '4:5' | '16:9' | 'original'
export type MenuName = 'aspectRatio' | 'zoom' | null

export const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  original: 0,
} as const

export const ImageCropper = ({
  image,
  initialAspectRatio = 'original',
  onCropAreaChange,
  isActiveSlide = true,
  onAspectRatioChange,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>(initialAspectRatio)
  const [activeMenu, setActiveMenu] = useState<MenuName>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const onCropChange = (crop: { x: number; y: number }) => {
    if (!isActiveSlide) return
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropAreaComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    if (!isActiveSlide || croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
      return
    }

    if (onCropAreaChange) {
      onCropAreaChange(croppedAreaPixels)
    }
  }

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    if (!isActiveSlide) return

    setCurrentAspectRatio(ratio)
    setActiveMenu(null)

    if (onAspectRatioChange) {
      onAspectRatioChange(ratio)
    }
  }

  if (!isActiveSlide) {
    return (
      <div className={s.imagePreview}>
        <ImageNext src={image} alt='Preview' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    )
  }

  useEffect(() => {
    if (!isActiveSlide) {
      setActiveMenu(null)
    }
  }, [isActiveSlide])

  useEffect(() => {
    if (!image || !isActiveSlide) return

    const initializeImage = async () => {
      try {
        const img = await createImage(image)
        setImageSize({ width: img.width, height: img.height })

        const defaultCropArea = {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        }

        if (onCropAreaChange) {
          onCropAreaChange(defaultCropArea)
        }

        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setRotation(0)
      } catch (error) {
        console.error('Error initializing image:', error)
      }
    }

    initializeImage()
  }, [image, isActiveSlide, onCropAreaChange])

  useEffect(() => {
    if (!isActiveSlide || !imageSize.width || !imageSize.height) return

    let cropWidth, cropHeight

    if (currentAspectRatio === 'original') {
      cropWidth = imageSize.width
      cropHeight = imageSize.height
    } else {
      const ratio = ASPECT_RATIO_MAP[currentAspectRatio]

      if (imageSize.width / imageSize.height > ratio) {
        cropHeight = imageSize.height
        cropWidth = cropHeight * ratio
      } else {
        cropWidth = imageSize.width
        cropHeight = cropWidth / ratio
      }
    }

    const croppedAreaPixels = {
      x: (imageSize.width - cropWidth) / 2,
      y: (imageSize.height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    }

    if (onCropAreaChange) {
      onCropAreaChange(croppedAreaPixels)
    }
  }, [currentAspectRatio, imageSize, isActiveSlide, onCropAreaChange])

  console.log(zoom)

  return (
    <div className={s.cropper}>
      <div className={s.cropContainer}>
        <Cropper
          image={image}
          objectFit={'contain'}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={
            currentAspectRatio === 'original' && imageSize.width > 0 ?
              imageSize.width / imageSize.height
            : ASPECT_RATIO_MAP[currentAspectRatio]
          }
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaComplete}
          classes={{
            containerClassName: s.cropContainer,
            cropAreaClassName: s.cropArea,
          }}
          minZoom={0.1}
          maxZoom={3}
        />
        <div className={s.cropControlsBox}>
          <div className={s.aspectRatioSelector}>
            <Button
              variant={'secondary'}
              onClick={() => (activeMenu === 'aspectRatio' ? setActiveMenu(null) : setActiveMenu('aspectRatio'))}
            >
              <IconExpandOutline />
            </Button>
            <div className={s.aspectRatioMenuWrapper}>
              {activeMenu === 'aspectRatio' && (
                <div className={s.aspectRatioMenu}>
                  <ul className={s.aspectRatioButtons}>
                    {(['1:1', '4:5', '16:9', 'original'] as AspectRatio[]).map((ratio) => (
                      <li key={ratio}>
                        <button
                          className={`${s.aspectRatioButton} ${currentAspectRatio === ratio ? s.active : ''}`}
                          onClick={() => handleAspectRatioChange(ratio)}
                        >
                          {ratio === 'original' ? 'Original' : ratio}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className={s.controls}>
            <Button
              variant={'secondary'}
              onClick={() => (activeMenu === 'zoom' ? setActiveMenu(null) : setActiveMenu('zoom'))}
            >
              <IconMaximizeOutline />
            </Button>
            <div className={s.zoomMenuWrapper}>
              {activeMenu === 'zoom' && (
                <div className={s.zoomMenu}>
                  <div className={s.sliderGroup}>
                    <input
                      type='range'
                      min='0.1'
                      max='3'
                      step='0.1'
                      value={zoom}
                      onChange={(e) => {
                        setZoom(Number(e.target.value))
                      }}
                      className={s.slider}
                    />
                    <span>{zoom.toFixed(1)}x</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
