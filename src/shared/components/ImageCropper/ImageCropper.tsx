'use client'

import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { Button } from '@/src/shared/components/Button/Button'
import s from './ImageCropper.module.scss'
import { IconExpandOutline, IconMaximizeOutline } from '@rocketweb-studio/ulens-ui-kit'

type Props = {
  image: string
  initialAspectRatio?: AspectRatio
  onCropAreaChange?: (areaPixels: Area) => void
  isActiveSlide?: boolean
  onAspectRatioChange?: (aspectRatio: AspectRatio) => void
}

type AspectRatio = '1:1' | '4:5' | '16:9' | 'original'
type MenuName = 'aspectRatio' | 'zoom' | null

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  original: 0,
} as const

export const ImageCropper = ({
  image,
  initialAspectRatio = 'original',
  onCropAreaChange,
  isActiveSlide,
  onAspectRatioChange,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>(initialAspectRatio)
  const [activeMenu, setActiveMenu] = useState<MenuName>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  const initializeImageSizeRef = useRef(async () => {
    if (isInitialized.current) return

    try {
      const img = await createImage(image)

      if (imageSize.width !== img.width || imageSize.height !== img.height) {
        setImageSize({ width: img.width, height: img.height })
      }

      const defaultCropArea = {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      }

      if (
        !croppedAreaPixels ||
        croppedAreaPixels.width !== defaultCropArea.width ||
        croppedAreaPixels.height !== defaultCropArea.height
      ) {
        setCroppedAreaPixels(defaultCropArea)
        if (onCropAreaChange) {
          onCropAreaChange(defaultCropArea)
        }
      }

      if (crop.x !== 0 || crop.y !== 0) {
        setCrop({ x: 0, y: 0 })
      }

      isInitialized.current = true
    } catch (error) {
      console.error('Error initializing image:', error)
    }
  })

  useEffect(() => {
    initializeImageSizeRef.current = async () => {
      if (isInitialized.current) return

      try {
        const img = await createImage(image)
        setImageSize({ width: img.width, height: img.height })

        const defaultCropArea = {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        }

        setCroppedAreaPixels(defaultCropArea)
        if (onCropAreaChange) {
          onCropAreaChange(defaultCropArea)
        }

        setCrop({ x: 0, y: 0 })
        isInitialized.current = true
      } catch (error) {
        console.error('Error initializing image:', error)
      }
    }
  }, [image, onCropAreaChange])

  useEffect(() => {
    if (isActiveSlide && image && !isInitialized.current) {
      initializeImageSizeRef.current()
    }
  }, [isActiveSlide, image])

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const lastCroppedAreaRef = useRef<Area | null>(null)

  const onCropAreaComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    if (croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
      return
    }

    const lastArea = lastCroppedAreaRef.current
    if (
      lastArea &&
      lastArea.x === croppedAreaPixels.x &&
      lastArea.y === croppedAreaPixels.y &&
      lastArea.width === croppedAreaPixels.width &&
      lastArea.height === croppedAreaPixels.height
    ) {
      return
    }

    lastCroppedAreaRef.current = croppedAreaPixels
    setCroppedAreaPixels(croppedAreaPixels)

    if (onCropAreaChange) {
      onCropAreaChange(croppedAreaPixels)
    }
  }

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setCurrentAspectRatio(ratio)
    setActiveMenu(null)

    if (onAspectRatioChange) {
      onAspectRatioChange(ratio)
    }
  }

  useEffect(() => {
    if (!isActiveSlide) {
      setActiveMenu(null)
    }
  }, [isActiveSlide])

  useEffect(() => {
    isInitialized.current = false
  }, [image])
  debugger
  return (
    <div className={s.cropper} ref={containerRef}>
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
          restrictPosition={false}
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

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  if (!pixelCrop || pixelCrop.width <= 0 || pixelCrop.height <= 0) {
    return imageSrc
  }

  try {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return imageSrc
    }

    canvas.width = Math.max(1, pixelCrop.width)
    canvas.height = Math.max(1, pixelCrop.height)

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    )

    return canvas.toDataURL('image/jpeg', 1)
  } catch (error) {
    console.error('Error cropping image:', error)
    return imageSrc
  }
}
