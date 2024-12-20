'use server'

import { db } from '@/db/db'
import { ProductCategory, products } from '@/db/schema'
import { and, eq, ilike } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ProductFilters = {
  query?: string
  category?: ProductCategory
  showDisabled?: boolean
}

export async function getProducts({
  query,
  category,
  showDisabled = true
}: ProductFilters = {}) {
  try {
    const conditions = []
    if (query) {
      conditions.push(ilike(products.name, `%${query}%`))
    }
    if (category) {
      conditions.push(eq(products.category, category))
    }
    if (!showDisabled) {
      conditions.push(eq(products.disabled, false))
    }

    const allProducts = await db
      .select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return { data: allProducts }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { error: 'Failed to fetch products' }
  }
}

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const category = formData.get('category') as ProductCategory
    const price = parseFloat(formData.get('price') as string)
    const isSpecialProduct = formData.get('isSpecialProduct') === 'true'
    const measureId = parseInt(formData.get('measureId') as string)

    if (!name || !category || !price || !measureId) {
      return { error: 'Missing required fields' }
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        category,
        price,
        disabled: false,
        isSpecialProduct,
        measureId
      })
      .returning()

    revalidatePath('/tab')
    revalidatePath('/admin/products')
    return { data: newProduct[0] }
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

interface UpdateProductData {
  disabled?: boolean
  price?: number
  name?: string
  category?: ProductCategory
  isSpecialProduct?: boolean
  measureId?: number
}

export async function updateProduct(
  productId: number,
  data: UpdateProductData
) {
  try {
    const updateData: UpdateProductData = {}

    if (typeof data.disabled === 'boolean') {
      updateData.disabled = data.disabled
    }

    if (typeof data.price === 'number') {
      updateData.price = data.price
    }

    if (typeof data.name === 'string') {
      updateData.name = data.name
    }

    if (data.category) {
      updateData.category = data.category
    }

    if (typeof data.isSpecialProduct === 'boolean') {
      updateData.isSpecialProduct = data.isSpecialProduct
    }

    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning()

    if (!updatedProduct.length) {
      throw new Error('Product not found')
    }

    revalidatePath('/admin/products')
    revalidatePath('/tab')
    return { success: true, data: updatedProduct[0] }
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('Failed to update product')
  }
}

export async function getProductByName(name: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.name, name)
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  } catch (error) {
    throw new Error('Failed to fetch product')
  }
}
