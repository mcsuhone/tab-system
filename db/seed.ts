import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ProductCategory, type NewProduct, type NewMeasurement } from './schema'
import { db } from '@/db/db'
import { measurements, products } from './schema'
import { eq } from 'drizzle-orm'

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
  Ruoat: 'OTHER'
}

async function importProducts() {
  // Read CSV file
  const csvFilePath = path.join(__dirname, 'old_data', 'products.csv')
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })

  // Parse CSV
  const records = parse(fileContent, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true
  })

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
      const category = categoryMapping[record.CATEGORY]
      if (!category) {
        console.warn(
          `Unknown category: ${record.CATEGORY} for product ${record.NAME}`
        )
        continue
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

// Run the import
importProducts()
  .then(() => console.log('Import completed'))
  .catch(console.error)
