'use client'

import { updateProduct } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Product } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { AnimatePresence, motion } from 'framer-motion'
import { Ban, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditProductDialog } from './edit-product-dialog'
import { ProductList } from './product-list'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
}

interface ProductItemProps {
  product: Product
  lastModifiedId: number | null
}

function AdminProductItem({
  product: initialProduct,
  lastModifiedId
}: ProductItemProps) {
  const [isPending, setIsPending] = useState(false)
  const [product, setProduct] = useState(initialProduct)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleToggleStatus = async () => {
    setIsPending(true)
    try {
      const result = await updateProduct(product.id, {
        disabled: !product.disabled
      })
      if (result.success && result.data) {
        setProduct(result.data)
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div
        className={`flex items-center gap-4 p-4 rounded-lg border mb-4 transition-all duration-300 ${
          product.disabled
            ? 'border-muted text-muted-foreground'
            : 'border-border text-foreground'
        } ${lastModifiedId === product.id ? 'bg-accent' : 'bg-background'}`}
      >
        <div className="flex-[60%]">
          <h3 className="font-semibold">{product.name}</h3>
        </div>
        <div className="flex-[30%]">
          <p className="text-sm">{categoryDisplayNames[product.category]}</p>
        </div>
        <div className="flex-[10%]">
          <p className="text-sm">{product.price.toFixed(2)}€</p>
        </div>
        <div className="flex-[10%] flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                disabled={isPending}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                <Ban className="mr-2 h-4 w-4" />
                {product.disabled ? 'Enable' : 'Disable'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditProductDialog
        product={product}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={(updatedProduct) => {
          setProduct(updatedProduct)
          setEditDialogOpen(false)
        }}
      />
    </>
  )
}

export function AdminProductList() {
  const [showDisabled, setShowDisabled] = useState(false)
  const [lastModifiedId, setLastModifiedId] = useState<number | null>(null)

  useEffect(() => {
    if (lastModifiedId !== null) {
      const timer = setTimeout(() => {
        setLastModifiedId(null)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [lastModifiedId])

  const renderProducts = (products: Product[]) => {
    // Filter out special products
    const regularProducts = products.filter((p) => !p.isSpecialProduct)

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            checked={showDisabled}
            onCheckedChange={setShowDisabled}
            id="show-disabled"
          />
          <label htmlFor="show-disabled">Show disabled products</label>
        </div>

        <AnimatePresence mode="wait">
          <motion.div variants={container} initial="hidden" animate="show">
            {regularProducts.map((product) => (
              <AdminProductItem
                key={product.id}
                product={product}
                lastModifiedId={lastModifiedId}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <ProductList showDisabled={showDisabled}>
      {(products) => renderProducts(products)}
    </ProductList>
  )
}
