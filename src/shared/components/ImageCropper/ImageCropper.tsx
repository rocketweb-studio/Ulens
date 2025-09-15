import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/src/shared/components/Button/Button'
import s from './ImageCropper.module.scss'

type Props = {
  image: string
  onCropComplete: (croppedImage: string) => void
  aspectRatio?: number
  initialAspectRatio?: number
}
type AspectRatio = '1:1' | '4:5' | '16:9' | 'free'

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  free: 0,
} as const

export const ImageCropper = ({ image, onCropComplete, initialAspectRatio = 1 }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>('1:1')

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onRotationChange = useCallback((rotation: number) => {
    setRotation(rotation)
  }, [])

  const onCropAreaComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    debugger
    setCurrentAspectRatio(ratio)
  }

  const handleCropComplete = async () => {
    debugger
    const croppedImage = await getCroppedImg()
    onCropComplete(croppedImage)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCurrentAspectRatio('1:1')
  }

  const getCroppedImg = async (): Promise<string> => {
    if (!croppedAreaPixels) return image

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return image

      const imageEl = new Image()
      imageEl.src = image

      await new Promise((resolve) => {
        imageEl.onload = resolve
      })

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      ctx.drawImage(
        imageEl,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      )

      return canvas.toDataURL('image/jpeg', 0.9)
    } catch (error) {
      console.error('Error cropping image:', error)
      return image
    }
  }

  return (
    <div className={s.cropper}>
      <div className={s.cropContainer}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={currentAspectRatio === 'free' ? undefined : ASPECT_RATIO_MAP[currentAspectRatio]}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          onCropComplete={onCropAreaComplete}
          classes={{
            containerClassName: s.cropContainer,
            cropAreaClassName: s.cropArea,
          }}
        />
        <div className={s.cropControlsBox}>
          <div className={s.aspectRatioSelector}>
            <h4>Aspect Ratio</h4>
            <div className={s.aspectRatioButtons}>
              {(['1:1', '4:5', '16:9', 'free'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  className={`${s.aspectRatioButton} ${currentAspectRatio === ratio ? s.active : ''}`}
                  onClick={() => {
                    handleAspectRatioChange(ratio)
                    handleCropComplete()
                  }}
                >
                  {ratio === 'free' ? 'Free' : ratio}
                </button>
              ))}
            </div>
          </div>

          <div className={s.controls}>
            <div className={s.sliderGroup}>
              <label>Zoom</label>
              <input
                type='range'
                min='1'
                max='3'
                step='0.1'
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={s.slider}
              />
              <span>{zoom.toFixed(1)}x</span>
            </div>

            <div className={s.sliderGroup}>
              <label>Rotation</label>
              <input
                type='range'
                min='-180'
                max='180'
                step='1'
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className={s.slider}
              />
              <span>{rotation}°</span>
            </div>
          </div>

          <div className={s.actions}>
            <Button variant='outline' onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleCropComplete}>Apply Crop</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
