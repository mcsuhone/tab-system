import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/modules/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const products = await db.product.findMany()
      res.status(200).json(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else if (req.method === 'POST') {
    const { name, category, price } = req.body
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    try {
      console.log('Adding product:', name, category, price)
      const product = await db.product.create({
        data: {
          name: name,
          category: category,
          price: price
        }
      })
      res.status(200).json(product)
    } catch (error) {
      console.error('Error adding product:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
