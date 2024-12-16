'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'
import { ProductCategory, products } from '@/db/schema'
import { eq, like, and } from 'drizzle-orm'

export type ProductFilters = {
  query?: string
  category?: ProductCategory
}

export async function getProducts({ query, category }: ProductFilters = {}) {
  try {
    const conditions = []
    if (query) {
      conditions.push(like(products.name, `%${query}%`))
    }
    if (category) {
      conditions.push(eq(products.category, category))
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

    if (!name || !category || !price) {
      return { error: 'Missing required fields' }
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        category,
        price
      })
      .returning()

    revalidatePath('/tab')
    return { data: newProduct[0] }
  } catch (error) {
    console.error('Error adding product:', error)
    return { error: 'Failed to add product' }
  }
}

export async function deleteProduct(id: number) {
  try {
    await db.delete(products).where(eq(products.id, id))
    revalidatePath('/tab')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Failed to delete product' }
  }
}
