'use server'

import { db } from '@/db/db'
import { ProductCategory, products, measurements } from '@/db/schema'
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
        .select({
          product: products,
          measurement: measurements
        })
        .from(products)
        .leftJoin(measurements, eq(products.measureId, measurements.id))
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .then((results) =>
          results.map(({ product, measurement }) => ({
            ...product,
            measurement
          }))
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...conditions))
        .then((result) => Number(result[0].count))
    ])

    return {
      products: allProducts,
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

      const [productWithMeasurement] = await db
        .select({
          product: products,
          measurement: measurements
        })
        .from(products)
        .leftJoin(measurements, eq(products.measureId, measurements.id))
        .where(eq(products.id, newProduct.id))

      revalidatePath('/tab')
      revalidatePath('/admin/products')

      return {
        product: {
          ...productWithMeasurement.product,
          measurement: productWithMeasurement.measurement
        },
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

      const [productWithMeasurement] = await db
        .select({
          product: products,
          measurement: measurements
        })
        .from(products)
        .leftJoin(measurements, eq(products.measureId, measurements.id))
        .where(eq(products.id, updatedProduct.id))

      if (!productWithMeasurement?.product) {
        return { error: 'Product not found' }
      }

      revalidatePath('/admin/products')
      revalidatePath('/tab')

      return {
        product: {
          ...productWithMeasurement.product,
          measurement: productWithMeasurement.measurement
        },
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
    const result = await db
      .select({
        product: products,
        measurement: measurements
      })
      .from(products)
      .leftJoin(measurements, eq(products.measureId, measurements.id))
      .where(eq(products.name, name))
      .execute()

    if (!result[0]?.product) {
      return { error: 'Product not found' }
    }

    return {
      data: {
        ...result[0].product,
        measurement: result[0].measurement
      }
    }
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
        .select({
          product: products,
          measurement: measurements
        })
        .from(products)
        .leftJoin(measurements, eq(products.measureId, measurements.id))
        .where(eq(products.isAdminProduct, true))
        .execute()
        .then((results) =>
          results.map(({ product, measurement }) => ({
            ...product,
            measurement
          }))
        )

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
