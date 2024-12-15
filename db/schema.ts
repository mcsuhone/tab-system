import {
  integer,
  serial,
  text,
  pgTable,
  timestamp,
  uniqueIndex,
  real,
  pgEnum
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const productCategoryEnum = pgEnum('product_category', [
  'BEER',
  'LONG_DRINK',
  'CIDER',
  'LIQUOR',
  'GIN',
  'VODKA',
  'WHISKEY',
  'RUM',
  'TEQUILA',
  'WINE',
  'SODA',
  'ENERGY_DRINK',
  'NON_ALCOHOLIC',
  'OTHER'
])
export type ProductCategory = (typeof productCategoryEnum.enumValues)[number]

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tab: integer('tab').notNull().default(0),
  name: text('name').notNull(),
  password: text('password').notNull()
})

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: productCategoryEnum('category').notNull(),
    price: real('price').notNull()
  },
  (table) => ({
    nameIdx: uniqueIndex('product_name_idx').on(table.name)
  })
)

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export const transactions = pgTable(
  'transactions',
  {
    id: serial('id').primaryKey(),
    amount: real('amount').notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    userIdx: uniqueIndex('transaction_user_idx').on(table.userId),
    productIdx: uniqueIndex('transaction_product_idx').on(table.productId)
  })
)

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id]
  })
}))

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions)
}))

// Type exports
export type User = InferSelectModel<typeof users> & {
  transactions: Transaction[]
}
export type NewUser = InferInsertModel<typeof users>

export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>

export type ActivityLog = InferSelectModel<typeof activityLogs>
export type NewActivityLog = InferInsertModel<typeof activityLogs>

export type Transaction = InferSelectModel<typeof transactions> & {
  product: Product
  user: User
}
export type NewTransaction = InferInsertModel<typeof transactions>
