'use server'

import { db } from '@/db/db'
import { products, transactions } from '@/db/schema'
import { auth } from '@/lib/auth'
import { withAuth } from '@/lib/auth-guard'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

interface TransactionItem {
  productId: number
  quantity: number
  pricePerUnit: number
}

export async function createTransaction({
  items
}: {
  items: TransactionItem[]
}) {
  const { user } = await auth()
  if (!user) throw new Error('Not authenticated')

  // Check if any items are admin products
  const foundProducts = await db.query.products.findMany({
    where: inArray(
      products.id,
      items.map((item) => item.productId)
    )
  })

  if (foundProducts.some((p) => p.isAdminProduct)) {
    throw new Error('Cannot use admin products in regular transactions')
  }

  // Create individual transactions for each item - negative amount for purchases
  await Promise.all(
    items.map((item) =>
      db.insert(transactions).values({
        userId: user.id,
        productId: item.productId,
        amount: -(item.quantity * item.pricePerUnit),
        createdAt: new Date()
      })
    )
  )

  revalidatePath('/tab')
  return { success: true }
}

export async function createAdminTransaction({
  userId,
  productId,
  amount
}: {
  userId: number
  productId: number
  amount: number
}) {
  return withAuth(
    async () => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      })

      if (!product?.isAdminProduct) {
        throw new Error('Invalid product for admin transaction')
      }

      // Amount will be positive for adding money, negative for subtracting
      await db.insert(transactions).values({
        userId,
        productId,
        amount: -(amount * product.price),
        createdAt: new Date()
      })

      revalidatePath('/admin/users')
      return {
        success: {
          title: 'Success',
          description: 'Transaction completed successfully'
        }
      }
    },
    { adminOnly: true }
  )
}
