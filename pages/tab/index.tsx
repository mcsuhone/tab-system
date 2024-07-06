import '@/styles/globals.css'

import { DataTable } from '@/components/ui/datatable'
import React, { Suspense } from 'react'
import db from '@/modules/db'
import { columns } from './columns'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Product } from '@prisma/client'

export const getServerSideProps = (async () => {
  const products = await db.product.findMany()

  return {
    props: {
      products: products
    }
  }
}) satisfies GetServerSideProps<{ products: Product[] }>

const Tab: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  products
}) => {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl mb-4">Piikki</h1>
      <Suspense fallback={<h2>Loading data</h2>}>
        <DataTable data={products} columns={columns} />
      </Suspense>
    </main>
  )
}

export default Tab
