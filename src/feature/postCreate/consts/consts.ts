export const FILES_VALIDATE = {
  maxFiles: 10,
  maxSize: 20 * 1024 * 1024,
  formats: ['.jpeg', '.jpg', '.png'],
  accept: {
    'image/jpeg': [],
    'image/jpg': [],
    'image/png': [],
  },
} as const
