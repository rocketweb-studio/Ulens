'use client'

import { ComponentType, useEffect, useRef, useState } from 'react'
import { Area } from 'react-easy-crop'
import { Button } from '@/src/shared/ui'
import s from './ImageCropper.module.scss'
import { IconExpandOutline, IconMaximizeOutline } from '@rocketweb-studio/ulens-ui-kit'
import ImageNext from 'next/image'
import dynamic from 'next/dynamic'
import { createImage } from '@/src/features/post/postCreate/utils/createImage'

const Cropper = dynamic(() => import('react-easy-crop').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className={s.loading}>Loading cropper...</div>,
}) as ComponentType<any>

type Props = {
  image: string
  initialAspectRatio?: AspectRatio
  initialZoom?: number
  initialCrop?: { x: number; y: number }
  onCropAreaChange?: (areaPixels: Area) => void
  onZoomChange?: (zoom: number) => void
  onCropChange?: (crop: { x: number; y: number }) => void
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
  initialZoom = 1,
  initialCrop = { x: 0, y: 0 },
  onCropAreaChange,
  onZoomChange,
  onCropChange,
  isActiveSlide = true,
  onAspectRatioChange,
}: Props) => {
  const [crop, setCrop] = useState(initialCrop)
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(0)
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>(initialAspectRatio)
  const [activeMenu, setActiveMenu] = useState<MenuName>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const prevImageRef = useRef<string>('')

  useEffect(() => {
    if (image !== prevImageRef.current) {
      setCrop(initialCrop)
      setZoom(initialZoom)
      setRotation(0)
      setCurrentAspectRatio(initialAspectRatio)
      setImageSize({ width: 0, height: 0 })
      setIsInitialized(false)
      prevImageRef.current = image
    }
  }, [image, initialCrop, initialZoom, initialAspectRatio])

  useEffect(() => {
    if (!image || !isActiveSlide || isInitialized) return

    const initializeImage = async () => {
      try {
        const img = await createImage(image)
        setImageSize({ width: img.width, height: img.height })
        setIsInitialized(true)

        let cropWidth, cropHeight

        if (currentAspectRatio === 'original') {
          cropWidth = img.width
          cropHeight = img.height
        } else {
          const ratio = ASPECT_RATIO_MAP[currentAspectRatio]

          if (img.width / img.height > ratio) {
            cropHeight = img.height
            cropWidth = cropHeight * ratio
          } else {
            cropWidth = img.width
            cropHeight = cropWidth / ratio
          }
        }

        const defaultCropArea = {
          x: (img.width - cropWidth) / 2,
          y: (img.height - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
        }

        if (onCropAreaChange) {
          onCropAreaChange(defaultCropArea)
        }
      } catch (error) {
        console.error('Error initializing image:', error)
      }
    }

    initializeImage()
  }, [image, isActiveSlide, isInitialized, currentAspectRatio, onCropAreaChange])

  const onCropChangeInternal = (newCrop: { x: number; y: number }) => {
    if (!isActiveSlide) return
    setCrop(newCrop)
    if (onCropChange) {
      onCropChange(newCrop)
    }
  }

  const onZoomChangeInternal = (newZoom: number) => {
    setZoom(newZoom)
    if (onZoomChange) {
      onZoomChange(newZoom)
    }
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

    setCrop({ x: 0, y: 0 })

    if (onAspectRatioChange) {
      onAspectRatioChange(ratio)
    }
  }

  if (!isActiveSlide) {
    return (
      <div className={s.imagePreview}>
        <ImageNext src={image} alt='Preview' fill style={{ objectFit: 'contain' }} />
      </div>
    )
  }

  return (
    <div className={s.cropper}>
      <div className={s.cropContainer}>
        {isInitialized && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={
              currentAspectRatio === 'original' && imageSize.width > 0 ?
                imageSize.width / imageSize.height
              : ASPECT_RATIO_MAP[currentAspectRatio]
            }
            onCropChange={onCropChangeInternal}
            onZoomChange={onZoomChangeInternal}
            onCropComplete={onCropAreaComplete}
            classes={{
              containerClassName: s.cropContainer,
              cropAreaClassName: s.cropArea,
            }}
            minZoom={0.1}
            maxZoom={3}
          />
        )}
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
                        onZoomChangeInternal(Number(e.target.value))
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
