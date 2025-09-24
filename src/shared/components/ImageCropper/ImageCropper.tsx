import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/src/shared/components/Button/Button'
import s from './ImageCropper.module.scss'
import { IconExpandOutline, IconMaximizeOutline } from '@rocketweb-studio/ulens-ui-kit'

type Props = {
  image: string
  onCropComplete: (croppedImage: string, areaPixels?: Area) => void
  aspectRatio?: number
  initialAspectRatio?: AspectRatio
  onCropAreaChange?: (areaPixels: Area) => void
  isActiveSlide?: boolean
}
type AspectRatio = '1:1' | '4:5' | '16:9' | 'original'
type MenuName = 'aspectRatio' | 'zoom' | null

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  original: 0,
} as const

export type FlipOptions = {
  horizontal: boolean
  vertical: boolean
}

export type PixelCrop = {
  x: number
  y: number
  width: number
  height: number
}

export type Size = {
  width: number
  height: number
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export const getRadianAngle = (degreeValue: number): number => (degreeValue * Math.PI) / 180

export const rotateSize = (width: number, height: number, rotation: number): Size => {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

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
}

export const ImageCropper = ({
  image,
  onCropComplete,
  initialAspectRatio = 'original',
  onCropAreaChange,
  isActiveSlide,
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

  // Функция для получения размеров изображения и расчета начального zoom
  const initializeImageSize = useCallback(async () => {
    if (isInitialized.current) return

    const img = await createImage(image)
    setImageSize({ width: img.width, height: img.height })

    // Центрируем изображение (zoom остается = 1)
    setCrop({ x: 0, y: 0 })
    isInitialized.current = true
  }, [image])

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onRotationChange = useCallback((rotation: number) => {
    setRotation(rotation)
  }, [])

  // Используем useRef для хранения последнего значения, чтобы избежать лишних вызовов
  const lastCroppedAreaRef = useRef<Area | null>(null)

  const onCropAreaComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      // Проверяем, изменилась ли область кадрирования
      const lastArea = lastCroppedAreaRef.current
      if (
        lastArea &&
        lastArea.x === croppedAreaPixels.x &&
        lastArea.y === croppedAreaPixels.y &&
        lastArea.width === croppedAreaPixels.width &&
        lastArea.height === croppedAreaPixels.height
      ) {
        return // Пропускаем если область не изменилась
      }

      lastCroppedAreaRef.current = croppedAreaPixels
      setCroppedAreaPixels(croppedAreaPixels)

      if (onCropAreaChange) {
        onCropAreaChange(croppedAreaPixels)
      }
    },
    [onCropAreaChange],
  )

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setCurrentAspectRatio(ratio)
    setActiveMenu(null)
  }

  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels)
    onCropComplete(croppedImage, croppedAreaPixels)
  }

  useEffect(() => {
    if (isActiveSlide && image && !isInitialized.current) {
      initializeImageSize()
    }
  }, [isActiveSlide, image, initializeImageSize])

  useEffect(() => {
    if (!isActiveSlide) {
      setActiveMenu(null)
      isInitialized.current = false // Сбрасываем флаг инициализации при смене слайда
    }
  }, [isActiveSlide])

  // Сбрасываем флаг инициализации при смене изображения
  useEffect(() => {
    isInitialized.current = false
  }, [image])

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
          onRotationChange={onRotationChange}
          onCropComplete={onCropAreaComplete}
          onCropAreaChange={onCropAreaComplete}
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
