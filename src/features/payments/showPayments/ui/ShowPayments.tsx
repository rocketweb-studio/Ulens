'use client'
import { CustomTable } from '@/src/shared/ui/CustomTable/CustomTable'
import { Column } from '@/src/shared/ui/CustomTable'
import { HTMLAttributes } from 'react'
import { Payment } from '@/src/features/payments/showPayments/model/types'
import { paymentsData } from '@/src/features/payments/showPayments/model/data'

export const ShowPayments = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const columns: Column<Payment>[] = [
    {
      key: 'dateOfPayment',
      title: 'Date of Payment',
      width: '150px',
    },
    {
      key: 'endDateOfSubscription',
      title: 'End date of subscription',
      width: '150px',
    },
    {
      key: 'price',
      title: 'Price',
      width: '100px',
    },
    {
      key: 'subscriptionType',
      title: 'Subscription Type',
      width: '150px',
    },
    {
      key: 'paymentType',
      title: 'Payment Type',
      width: '120px',
    },
  ]

  return (
    <div className={className}>
      <CustomTable data={paymentsData} columns={columns} paginated></CustomTable>
    </div>
  )
}
