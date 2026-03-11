'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, XIcon } from 'lucide-react'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type PaymentColumn = {
   id: string
   number: string
   isSuccessful: boolean
   payable: string
   status: string
   createdAt: string
}

export const columns: ColumnDef<PaymentColumn>[] = [
   {
      accessorKey: 'number',
      header: 'Ödeme No',
   },
   {
      accessorKey: 'date',
      header: 'Tarih',
   },
   {
      accessorKey: 'payable',
      header: 'Tutar',
   },
   {
      accessorKey: 'isSuccessful',
      header: 'Başarılı',
      cell: (props) => {
         return props.cell.getValue() ? <CheckIcon /> : <XIcon />
      },
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/payments/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
