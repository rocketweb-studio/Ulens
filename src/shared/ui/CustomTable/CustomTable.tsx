import React, { useEffect, useState } from 'react'
import s from './CustomTable.module.scss'
import { CustomTableProps, TableCellProps } from '@/src/shared/ui/CustomTable/types'
import { Pagination } from '@rocketweb-studio/ulens-ui-kit/'

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

export const CustomTable = <T extends Record<string, any>>({
  data,
  columns,
  className = '',
  paginated = false,
}: CustomTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [paginatedData, setPaginatedData] = useState<T[]>([])

  useEffect(() => {
    const startIndex = (currentPage - 1) * currentPageSize
    const endIndex = startIndex + currentPageSize
    setPaginatedData(data.slice(startIndex, endIndex))
  }, [data, currentPage, currentPageSize])

  const handlePageChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setCurrentPage(page)
    setCurrentPageSize(pageSize)
  }

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
          {paginatedData.map((row, index) => (
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
      {paginated && (
        <div className={s.paginationWrapper}>
          <Pagination onPageChange={handlePageChange} elementCount={data.length} />
        </div>
      )}
    </div>
  )
}
