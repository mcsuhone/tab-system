import { db } from '@/db/db'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { measurements, NewUser, ProductCategory, products, users, type NewMeasurement, type NewProduct } from './schema'

// Get current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Category mapping from CSV to database enum
const categoryMapping: Record<string, ProductCategory> = {
  'Muut väkevät': 'OTHER_LIQUOR',
  Gin: 'GIN',
  Likööri: 'LIQUOR',
  Rommi: 'RUM',
  Tequila: 'TEQUILA',
  Vodka: 'VODKA',
  Viski: 'WHISKEY',
  Konjakki: 'OTHER_LIQUOR',
  Absintti: 'OTHER_LIQUOR',
  Alkoholittomat: 'NON_ALCOHOLIC',
  Ruoat: 'FOOD',
  Grappa: 'GRAPPA'
}

export async function importProducts() {
  // Read CSV file
  const filePath = path.join(__dirname, 'old_data', 'exported_prices.json')
  let records: any[] = []
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    records = JSON.parse(fileContent)
  } catch (error) {
    console.error(`Failed to open file:`, error)
    return
  }


  for (const record of records) {
    try {
      // Create or find measurement
      const measurementData: NewMeasurement = {
        amount: parseFloat(record.SIZE),
        unit: record.UNIT.toLowerCase()
      }

      // Check if measurement already exists
      let measurement = await db.query.measurements.findFirst({
        where:
          eq(measurements.amount, measurementData.amount) &&
          eq(measurements.unit, measurementData.unit)
      })

      if (!measurement) {
        const [newMeasurement] = await db
          .insert(measurements)
          .values(measurementData)
          .returning()
        measurement = newMeasurement
      }

      // Map category
      let category: ProductCategory
      if (!(record.CATEGORY in categoryMapping)) {
        category = 'OTHER'
      } else {
        category = categoryMapping[record.CATEGORY]
      }

      // Create product
      const productData: NewProduct = {
        name: record.NAME,
        category: category,
        price: parseFloat(record.PRICE.replace(',', '.')),
        disabled: record.ACTIVE.toLowerCase() !== 'active',
        isSpecialProduct: false,
        measureId: measurement.id
      }

      await db.insert(products).values(productData)
      console.log(`Imported: ${record.NAME}`)
    } catch (error) {
      console.error(`Failed to import ${record.NAME}:`, error)
    }
  }
}

export async function importUsers() {
  const filePath = path.join(__dirname, 'old_data', 'exported_users.json')
  let records: any[] = []
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    records = JSON.parse(fileContent)
  } catch (error) {
    console.error(`Failed to open file:`, error)
    return
  }

  for (const record of records) {
    try {
      const userData: NewUser = {
        name: record.name,
        member_no: record.memberID.toString(),
        balance: record.balance || 0,
        password: '',
        permission: 'default'
      }

      await db.insert(users).values(userData)
      console.log(`Imported user: ${record.name} (Member #${record.memberID})`)
    } catch (error) {
      console.error(`Failed to import user ${record.name}:`, error)
    }
  }
}
