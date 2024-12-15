import { NextResponse } from 'next/server'
import db from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allProducts = await db.select().from(products)
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, category, price } = await request.json()

    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        category,
        price
      })
      .returning()

    return NextResponse.json(newProduct[0])
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
