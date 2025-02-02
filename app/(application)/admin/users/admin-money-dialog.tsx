'use client'

import { createAdminTransaction } from '@/app/actions/transactions'
import PriceInput from '@/components/input/price-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AdminUser, Product } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'

interface AdminMoneyDialog {
  user: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  adminProducts: Product[]
}

export function AdminMoneyDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
  adminProducts
}: AdminMoneyDialog) {
  const { toast } = useToast()
  const [amount, setAmount] = useState('0')
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  useEffect(() => {
    if (adminProducts.length > 0) {
      setSelectedProduct(adminProducts[0].id)
    }
  }, [adminProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const result = await createAdminTransaction({
      userId: user.id,
      productId: selectedProduct,
      amount: parseFloat(amount)
    })

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else {
      toast({
        title: result.data.success?.title,
        description: result.data.success?.description
      })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Balance</DialogTitle>
          <DialogDescription>
            Add or subtract money from {user.name}&apos;s balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Select
                value={selectedProduct?.toString()}
                onValueChange={(value) => setSelectedProduct(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {adminProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2">
              <PriceInput price={amount} onPriceChange={setAmount} min="0" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!selectedProduct}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
