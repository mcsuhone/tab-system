'use server'

import { db } from '@/db/db'
import { transactions } from '@/db/schema'
import { auth } from '@/lib/auth'
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

  // Create individual transactions for each item
  await Promise.all(
    items.map((item) =>
      db.insert(transactions).values({
        userId: user.id,
        productId: item.productId,
        amount: item.quantity * item.pricePerUnit,
        createdAt: new Date()
      })
    )
  )

  revalidatePath('/tab')
  return { success: true }
}
