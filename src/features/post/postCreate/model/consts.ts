import { Filter } from '@/src/features/post/postCreate/model/types'

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

export const FILTERS: Filter[] = [
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
]
