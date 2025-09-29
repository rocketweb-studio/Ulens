import { FILES_VALIDATE } from '@/src/feature/postCreate/consts/consts'

export const dropErrorSnackBar = (rejectedFiles: any[]): string => {
  const firstError = rejectedFiles[0].errors[0]

  let errorMessage = ''

  switch (firstError.code) {
    case 'file-too-large':
      errorMessage = `The photos must be less than: ${FILES_VALIDATE.maxSize / (1024 * 1024)}MB`
      break
    case 'file-invalid-type':
      errorMessage = `Invalid file format. Allowed formats: ${FILES_VALIDATE.formats.join(', ')}`
      break
    case 'too-many-files':
      errorMessage = `There are too many files. Maximum: ${FILES_VALIDATE.maxFiles}`
      break
    default:
      errorMessage = `Ошибка: ${firstError.message}`
  }

  return errorMessage
}
