'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type ReturnColumn = {
   id: string
   number: string
   orderNumber: string
   userName: string
   userEmail: string
   reason: string
   status: string
   statusRaw: string
   refundAmount: string
   createdAt: string
}

const statusColors: Record<string, string> = {
   Pending: 'bg-yellow-100 text-yellow-800',
   Approved: 'bg-green-100 text-green-800',
   ReturnShipping: 'bg-purple-100 text-purple-800',
   Received: 'bg-blue-100 text-blue-800',
   Refunded: 'bg-gray-100 text-gray-800',
   Rejected: 'bg-red-100 text-red-800',
}

export const ReturnColumns: ColumnDef<ReturnColumn>[] = [
   {
      accessorKey: 'number',
      header: 'No',
   },
   {
      accessorKey: 'orderNumber',
      header: 'Siparis',
   },
   {
      accessorKey: 'userName',
      header: 'Musteri',
   },
   {
      accessorKey: 'reason',
      header: 'Sebep',
   },
   {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => (
         <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[row.original.statusRaw] || 'bg-gray-100 text-gray-800'}`}
         >
            {row.original.status}
         </span>
      ),
   },
   {
      accessorKey: 'refundAmount',
      header: 'Iade Tutari',
   },
   {
      accessorKey: 'createdAt',
      header: 'Tarih',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/returns/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]

interface ReturnTableProps {
   data: ReturnColumn[]
}

export const ReturnTable: React.FC<ReturnTableProps> = ({ data }) => {
   return <DataTable searchKey="userName" columns={ReturnColumns} data={data} />
}
