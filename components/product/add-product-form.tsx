'use client'

import {
  addProduct,
  getProductByName,
  updateProduct
} from '@/app/actions/products'
import { Button } from '@/components/ui/button'
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
import { Measurement, Product, productCategoryEnum } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { EnableProductDialog } from './enable-product-dialog'
import { getMeasurements } from '@/app/actions/measurements'

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

interface AddProductFormProps {
  onSuccess?: () => void
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [existingProduct, setExistingProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
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
      name: '',
      price: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('category', values.category)
        formData.append('price', values.price)
        formData.append('measureId', values.measureId.toString())
        await addProduct(formData)
        form.reset()
        onSuccess?.()
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate')) {
          try {
            const response = await getProductByName(values.name)
            if ('data' in response) {
              setExistingProduct(response.data as Product)
              setDialogOpen(true)
            }
          } catch (e) {
            console.error(e)
          }
        } else {
          throw error
        }
      }
    })
  }

  const handleEnableProduct = async (newPrice: number) => {
    if (!existingProduct) return

    startTransition(async () => {
      await updateProduct(existingProduct.id, {
        disabled: false,
        price: newPrice
      })
      form.reset()
      setDialogOpen(false)
      onSuccess?.()
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 max-w-md"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
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
                          onSelect={() => {
                            field.onChange(category)
                          }}
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
                                measurements.find((m) => m.id === field.value)!
                                  .amount
                              } ${
                                measurements.find((m) => m.id === field.value)!
                                  .unit
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
                          onSelect={() => {
                            field.onChange(measurement.id)
                          }}
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
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
      </Form>

      <EnableProductDialog
        product={existingProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleEnableProduct}
      />
    </>
  )
}
