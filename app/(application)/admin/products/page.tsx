import { Metadata } from 'next'
import AdminProductsClient from './page-client'

export const metadata: Metadata = {
  title: 'Product Management',
  description: 'Manage products in the tab system'
}

export default async function AdminProductsPage() {
  return <AdminProductsClient />
}
