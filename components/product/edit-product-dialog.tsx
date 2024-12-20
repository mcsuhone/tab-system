'use client'

import { updateProduct } from '@/app/actions/products'
import { getMeasurements } from '@/app/actions/measurements'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Product, productCategoryEnum, Measurement } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  category: z.enum(productCategoryEnum.enumValues, {
    required_error: 'Please select a category.'
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number'
  }),
  measureId: z.number({
    required_error: 'Please select a measurement.'
  })
})

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (product: Product) => void
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  onSuccess
}: EditProductDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  useEffect(() => {
    const loadMeasurements = async () => {
      const { data } = await getMeasurements()
      if (data) {
        setMeasurements(data)
      }
    }
    loadMeasurements()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      measureId: product.measureId || undefined
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true)
    try {
      const result = await updateProduct(product.id, {
        name: values.name,
        category: values.category,
        price: parseFloat(values.price),
        measureId: values.measureId
      })
      if (result.success && result.data) {
        onSuccess(result.data)
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          role="combobox"
                        >
                          {field.value
                            ? categoryDisplayNames[field.value]
                            : 'Select category'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto min-w-[var(--radix-dropdown-menu-trigger-width)]">
                        {productCategoryEnum.enumValues.map((category) => (
                          <DropdownMenuItem
                            key={category}
                            onSelect={() => field.onChange(category)}
                          >
                            {categoryDisplayNames[category]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="measureId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement (1 pcs = x)</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          role="combobox"
                        >
                          {field.value
                            ? measurements.find((m) => m.id === field.value)
                              ? `${
                                  measurements.find(
                                    (m) => m.id === field.value
                                  )!.amount
                                } ${
                                  measurements.find(
                                    (m) => m.id === field.value
                                  )!.unit
                                }`
                              : 'Select measurement'
                            : 'Select measurement'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto min-w-[var(--radix-dropdown-menu-trigger-width)]">
                        {measurements.map((measurement) => (
                          <DropdownMenuItem
                            key={measurement.id}
                            onSelect={() => field.onChange(measurement.id)}
                          >
                            {measurement.amount} {measurement.unit}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
