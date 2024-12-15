import '@/styles/globals.css'
import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await db.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else if (req.method === 'POST') {
    const { user_id, name } = req.body
    try {
      const user = await db.user.create({
        data: {
          id: parseInt(user_id),
          name: name
        }
      })
      res.status(200).json(user)
    } catch (error) {
      console.error('Error adding user:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
