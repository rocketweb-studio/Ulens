import React from 'react'
import styles from './FlexContainer.module.scss'

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around'
export type AlignItems = 'stretch' | 'start' | 'end' | 'center'
export type Gap = number | string

export type Props = {
  children: React.ReactNode
  direction?: FlexDirection
  justify?: JustifyContent
  align?: AlignItems
  gap?: Gap
  wrap?: boolean
  className?: string
  style?: React.CSSProperties
}

export const FlexContainer = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 0,
  wrap = false,
  className = '',
  style = {},
}: Props) => {
  const flexClass = `
                 ${styles.flex}
                 ${styles[`dir-${direction}`]}
                 ${styles[`justify-${justify}`]}
                 ${styles[`align-${align}`]}
                 ${wrap ? styles.wrap : ''}
                 ${className}
                 `.trim()

  const flexStyle: React.CSSProperties = {
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style,
  }

  return (
    <div className={flexClass} style={flexStyle}>
      {children}
    </div>
  )
}
