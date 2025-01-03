'use server'

import { db } from '@/db/db'
import { ProductCategory, products } from '@/db/schema'
import { and, eq, ilike, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { withAuth } from '@/lib/auth-guard'

export type ProductFilters = {
  query?: string
  category?: ProductCategory
  showDisabled?: boolean
  page?: number
  limit?: number
}

export async function getProducts({
  query,
  category,
  showDisabled = true,
  page = 1,
  limit = 30
}: ProductFilters = {}) {
  try {
    const conditions = [eq(products.isAdminProduct, false)]

    if (query) {
      conditions.push(ilike(products.name, `%${query}%`))
    }
    if (category) {
      conditions.push(eq(products.category, category))
    }
    if (!showDisabled) {
      conditions.push(eq(products.disabled, false))
    }

    const offset = (page - 1) * limit

    const [allProducts, totalCount] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...conditions))
        .then((result) => Number(result[0].count))
    ])

    return {
      data: allProducts,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasMore: page * limit < totalCount
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { error: 'Failed to fetch products' }
  }
}

export async function addProduct(formData: FormData) {
  return withAuth(
    async () => {
      const name = formData.get('name') as string
      const category = formData.get('category') as ProductCategory
      const price = parseFloat(formData.get('price') as string)
      const isSpecialProduct = formData.get('isSpecialProduct') === 'true'
      const measureId = parseInt(formData.get('measureId') as string)

      if (!name || !category || !price || !measureId) {
        return {
          error: {
            title: 'Validation Error',
            description: 'Missing required fields'
          }
        }
      }

      const [newProduct] = await db
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

      return {
        data: newProduct,
        success: {
          title: 'Success',
          description: 'Product added successfully'
        }
      }
    },
    { adminOnly: true }
  )
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
  return withAuth(
    async () => {
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

      const [updatedProduct] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, productId))
        .returning()

      if (!updatedProduct) {
        return {
          error: {
            title: 'Error',
            description: 'Product not found'
          }
        }
      }

      revalidatePath('/admin/products')
      revalidatePath('/tab')

      return {
        data: updatedProduct,
        success: {
          title: 'Success',
          description: 'Product updated successfully'
        }
      }
    },
    { adminOnly: true }
  )
}

export async function getProductByName(name: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.name, name)
    })

    if (!product) {
      return {
        error: {
          title: 'Error',
          description: 'Product not found'
        }
      }
    }

    return { data: product }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to fetch product'
      }
    }
  }
}

export async function getAdminProducts() {
  return withAuth(
    async () => {
      const adminProducts = await db
        .select()
        .from(products)
        .where(eq(products.isAdminProduct, true))
        .execute()

      console.log('adminProducts', adminProducts)
      return {
        products: adminProducts,
        success: {
          title: 'Success',
          description: 'Admin products fetched successfully'
        }
      }
    },
    { adminOnly: true }
  )
}
