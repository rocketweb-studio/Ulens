import { CSSProperties, ReactNode } from 'react'

export type Column<T> = {
  key: keyof T
  title: string
  render?: (value: T[keyof T], row: T) => ReactNode
  width?: string
}

export type CustomTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  className?: string
  paginated?: boolean
}

export type TableCellProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}
