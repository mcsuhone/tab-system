import bcrypt from 'bcryptjs'
import { eq, and, inArray } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './db'
import { users, products } from './schema'

const DEFAULT_ADMIN_USERNAME = 'admin'

const ADMIN_PRODUCTS = {
  ADD_MONEY: {
    name: 'Add Money',
    price: -1,
    category: 'OTHER' as const,
    isSpecialProduct: false,
    isAdminProduct: true
  },
  SUBTRACT_MONEY: {
    name: 'Subtract Money',
    price: 1,
    category: 'OTHER' as const,
    isSpecialProduct: false,
    isAdminProduct: true
  }
} as const

async function main() {
  console.log('Starting migration...')
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migration completed!')

    // Check if root user exists
    const existingRoot = await db
      .select()
      .from(users)
      .where(eq(users.name, DEFAULT_ADMIN_USERNAME))
      .execute()

    if (existingRoot.length === 0) {
      console.log(
        '\nNo root user found. Creating root user from environment variables...'
      )
      const username = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME
      const password = process.env.ADMIN_PASSWORD

      if (!password) {
        throw new Error(
          'ADMIN_PASSWORD environment variable is required for first run'
        )
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10)

      await db
        .insert(users)
        .values({
          name: username,
          password: hashedPassword,
          balance: 0,
          member_no: '0',
          permission: 'admin'
        })
        .execute()

      console.log('Root user created successfully!')
    }

    // After creating root user, check for required admin products
    console.log('\nChecking for required admin products...')
    const existingAdminProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isAdminProduct, true),
          inArray(products.name, [
            ADMIN_PRODUCTS.ADD_MONEY.name,
            ADMIN_PRODUCTS.SUBTRACT_MONEY.name
          ])
        )
      )
      .execute()

    const missingProducts = [
      ADMIN_PRODUCTS.ADD_MONEY,
      ADMIN_PRODUCTS.SUBTRACT_MONEY
    ].filter(
      (product) => !existingAdminProducts.some((p) => p.name === product.name)
    )

    if (missingProducts.length > 0) {
      console.log(
        'Creating missing admin products:',
        missingProducts.map((p) => p.name).join(', ')
      )
      await db.insert(products).values(missingProducts).execute()
      console.log('Admin products created successfully!')
    } else {
      console.log('All required admin products exist')
    }

    // Check if there are any products in the database
    const existingProducts = await db
      .select()
      .from(products)
      .execute()

    if (existingProducts.length === 0) {
      console.log('\nNo products found in database. Running seed script...')
      const { importProducts } = await import('./seed.js')
      await importProducts()
      console.log('Products seeded successfully!')
    }

  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  }
}

// Export for use in other files
export const runMigrations = main

// Run migrations immediately
console.log('Migration script started')
main().catch((err) => {
  console.error('Migration failed!', err)
  process.exit(1)
})
