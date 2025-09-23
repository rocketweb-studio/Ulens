import { ReactNode } from 'react'

export type TSlide = {
  id: string | number
  content: ReactNode
  slideProps?: Record<string, any>
}

export type TCustomSwiperProps = {
  slides: TSlide[]
  swiperProps?: Record<string, any>
  navigation?: boolean
  pagination?: boolean
  autoplay?: boolean | { delay: number }
  className?: string
  breakpoints?: Record<string, any>
  allowTouchMove?: boolean
  onSlideChange?: (swiper: any) => void
}

export type TNavigationButtonsProps = {
  onPrev: () => void
  onNext: () => void
  isBeginning: boolean
  isEnd: boolean
  className?: string
}
