// pages/api/getUsers.ts
import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/modules/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid user id' })
      }

      const user = await db.user.findFirst({
        where: {
          id: parseInt(id)
        }
      })
      res.status(200).json(user)
      
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
