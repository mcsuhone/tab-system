import {
  integer,
  serial,
  text,
  pgTable,
  timestamp,
  uniqueIndex,
  real,
  pgEnum,
  boolean,
  jsonb
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
  'COCKTAIL',
  'OTHER'
])
export type ProductCategory = (typeof productCategoryEnum.enumValues)[number]

export const userPermissionEnum = pgEnum('user_permission', [
  'default',
  'admin'
])
export type UserPermission = (typeof userPermissionEnum.enumValues)[number]

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  balance: integer('balance').notNull().default(0),
  name: text('name').notNull(),
  member_no: text('member_no').notNull(),
  password: text('password').notNull(),
  permission: userPermissionEnum('permission').notNull().default('default')
})

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: productCategoryEnum('category').notNull(),
    price: real('price').notNull(),
    disabled: boolean('disabled').notNull().default(false),
    isSpecialProduct: boolean('is_special_product').notNull().default(false)
  },
  (table) => ({
    nameIdx: uniqueIndex('product_name_idx').on(table.name)
  })
)

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  details: jsonb('details'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export const transactions = pgTable('transactions', {
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
})

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
