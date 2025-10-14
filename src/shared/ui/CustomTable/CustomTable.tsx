import React from 'react'
import s from './CustomTable.module.scss'
import { CustomTableProps, TableCellProps } from '@/src/shared/ui/CustomTable/types'

const TableCell = ({ children, className = '', style }: TableCellProps) => (
  <td className={`${s.cell} ${className}`} style={style}>
    {children}
  </td>
)

const TableHeader = ({ children, className = '', style }: TableCellProps) => (
  <th className={`${s.cell} ${s.header} ${className}`} style={style}>
    {children}
  </th>
)

export const CustomTable = <T extends Record<string, any>>({ data, columns, className = '' }: CustomTableProps<T>) => {
  return (
    <div className={`${s.container} ${className}`}>
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <TableHeader key={String(column.key)} style={{ width: column.width }}>
                {column.title}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={s.row}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
