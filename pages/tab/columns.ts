import { Product } from '@/db/schema'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Tuote'
  },
  {
    accessorKey: 'category',
    header: 'Kategoria'
  },
  {
    accessorKey: 'price',
    header: 'Hinta'
  }
]
