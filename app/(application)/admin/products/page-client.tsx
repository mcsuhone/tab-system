'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useState } from 'react'
import { AddProductForm } from '@/components/product/add-product-form'
import { AdminProductItems } from './admin-product-items'

export default function AdminProductsClient() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus strokeWidth={2.5} className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProductForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <h2 className="shrink-0 mb-4 text-xl font-semibold">Products</h2>
      <div className="overflow-hidden">
        <AdminProductItems />
      </div>
    </div>
  )
}
