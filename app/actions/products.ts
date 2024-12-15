'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'
import { ProductCategory, products } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getProducts() {
  try {
    const allProducts = await db.select().from(products)
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
