import { ValueLabelPair } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'

// This is not nice to upkeep this duplicate list but will work for now
const categories: ValueLabelPair<string, string>[] = [
  {
    value: 'BEER',
    label: 'Olut'
  },
  {
    value: 'CIDER',
    label: 'Siideri'
  },
  {
    value: 'LIQUOR',
    label: 'Viina'
  },
  {
    value: 'GIN',
    label: 'Gin'
  },
  {
    value: 'VODKA',
    label: 'Vodka'
  },
  {
    value: 'WHISKEY',
    label: 'Viski'
  },
  {
    value: 'RUM',
    label: 'Rommi'
  },
  {
    value: 'TEQUILA',
    label: 'Tequila'
  },
  {
    value: 'WINE',
    label: 'Viini'
  },
  {
    value: 'SODA',
    label: 'Limu'
  },
  {
    value: 'ENERGY_DRINK',
    label: 'Energiajuoma'
  },
  {
    value: 'NON_ALCOHOLIC',
    label: 'Alkoholiton'
  },
  {
    value: 'OTHER',
    label: 'Muu'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      res.status(200).json(categories)
    } catch (e) {
      console.error('Error fetching categories:', e)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
