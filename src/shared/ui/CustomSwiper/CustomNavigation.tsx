import React from 'react'
import styles from './CustomSwiper.module.scss'
import type { TNavigationButtonsProps } from './types'

export const CustomNavigation = ({ onPrev, onNext, isBeginning, isEnd, className = '' }: TNavigationButtonsProps) => {
  return (
    <div className={`${styles.navigation} ${className}`}>
      <button
        className={`${styles.navButton} ${styles.prevButton} ${isBeginning ? styles.disabled : ''}`}
        onClick={onPrev}
        disabled={isBeginning}
        aria-label='Previous slide'
      >
        <svg className={styles.navIcon} width='20' height='20' viewBox='0 0 24 24' fill='none'>
          <path d='M15 18L9 12L15 6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      <button
        className={`${styles.navButton} ${styles.nextButton} ${isEnd ? styles.disabled : ''}`}
        onClick={onNext}
        disabled={isEnd}
        aria-label='Next slide'
      >
        <svg className={styles.navIcon} width='20' height='20' viewBox='0 0 24 24' fill='none'>
          <path d='M9 18L15 12L9 6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>
    </div>
  )
}
