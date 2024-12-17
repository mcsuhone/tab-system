'use client'

import React from 'react'
import { AdminProductList } from '@/components/product/admin-product-list'
import { AddProductForm } from '@/components/product/add-product-form'
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

export default function AdminProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
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

      <div>
        <h2 className="mb-4 text-xl font-semibold">Products</h2>
        <AdminProductList />
      </div>
    </div>
  )
}
