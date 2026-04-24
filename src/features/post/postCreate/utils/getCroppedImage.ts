import { Area } from 'react-easy-crop'
import { createImage } from '@/src/features/post/postCreate/utils/createImage'

export const getCroppedImg = async (imageSrc: any, pixelCrop: Area): Promise<string> => {
  const safeSrc = typeof imageSrc === 'string' ? imageSrc : String(imageSrc?.file || '')

  if (!safeSrc || !pixelCrop || pixelCrop.width <= 0 || pixelCrop.height <= 0) {
    return safeSrc
  }

  try {
    const image = await createImage(safeSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return safeSrc

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
    return safeSrc
  }
}
