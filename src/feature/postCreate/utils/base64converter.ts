export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const base64ToFile = (base64: string, filename: string): Promise<File> => {
  return new Promise((resolve) => {
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => {
        resolve(new File([blob], filename, { type: 'image/jpeg' }))
      })
  })
}

export const createOriginalImageData = async (imageUrl: string): Promise<string> => {
  return imageUrl
}
