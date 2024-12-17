'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  addProduct,
  getProductByName,
  updateProduct
} from '@/app/actions/products'
import { useTransition, useState } from 'react'
import { Product, ProductCategory, productCategoryEnum } from '@/db/schema'
import { categoryDisplayNames } from '@/lib/product-categories'
import { ChevronDown } from 'lucide-react'
import { EnableProductDialog } from './enable-product-dialog'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  category: z.enum(productCategoryEnum.enumValues, {
    required_error: 'Please select a category.'
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number'
  })
})

interface AddProductFormProps {
  onSuccess?: () => void
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null)
  const [existingProduct, setExistingProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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
        await addProduct(formData)
        form.reset()
        setSelectedCategory(null)
        onSuccess?.()
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate')) {
          try {
            const product = await getProductByName(values.name)
            setExistingProduct(product)
            setDialogOpen(true)
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
      setSelectedCategory(null)
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
                            setSelectedCategory(category)
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
