'use client'
import '@/styles/globals.css'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Product } from '@prisma/client'
import { useEffect, useState } from 'react'
import { ValueLabelPair } from '@/types'
import { HTMLForm } from '@/components/ui/htmlform'

const formSchema = z.object({
  name: z.string(),
  category: z.string({
    required_error: 'Please select a category.'
  }),
  price: z.string().refine((val) => {
    const parsed = parseFloat(val)
    return !isNaN(parsed) && parsed >= 0
  })
})

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<
    ValueLabelPair<string, string>[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      price: ''
    }
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`/api/products/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        const foundCategories = await response.json()
        setCategories(foundCategories)
      }
    }

    const fetchProducts = async () => {
      const response = await fetch(`/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        const foundProducts: Product[] = await response.json()
        setProducts(foundProducts)
      }
    }
    fetchCategories()
    fetchProducts()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedValues = { ...values, price: parseFloat(values.price) }
    const response = await fetch(`/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedValues)
    })
    if (response.status === 200) {
      const newProduct: Product = await response.json()
      setProducts([...products, newProduct])
    }
  }

  return (
    <>
      <h2 className="text-4xl p-10">Add new product</h2>
      <Form {...form}>
        <HTMLForm onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <Combobox
                  field={field}
                  options={categories}
                  placeholder_text="Select category"
                  empty_text="No category found"
                />
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
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Add product</Button>
        </HTMLForm>
      </Form>
      {/* TODO: Use some table component here */}
      <div className="mt-8">
        <h2 className="text-4xl p-10">Products</h2>
        {products.map((product) => (
          <div key={product.id}>
            <p>
              {product.name} - {product.category} - {product.price}€
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
