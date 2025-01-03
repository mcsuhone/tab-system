'use server'

import { db } from '@/db/db'
import { users, UserPermission } from '@/db/schema'
import { eq, or, ilike, and, sql, asc } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import { withAuth } from '@/lib/auth-guard'

interface GetUsersOptions {
  query?: string
  page?: number
  limit?: number
}

export async function getUsers({
  query,
  page = 1,
  limit = 10
}: GetUsersOptions = {}) {
  return withAuth(
    async () => {
      const conditions = []

      if (query) {
        conditions.push(
          or(
            ilike(users.name, `%${query}%`),
            ilike(users.member_no, `%${query}%`)
          )
        )
      }

      const offset = (page - 1) * limit

      const [data, totalCount] = await Promise.all([
        db
          .select()
          .from(users)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(sql`CAST(${users.member_no} AS INTEGER)`)
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .then((result) => Number(result[0].count))
      ])

      return {
        data,
        pagination: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          hasMore: page * limit < totalCount
        }
      }
    },
    { adminOnly: true }
  )
}

export async function createUser(data: {
  name: string
  member_no: string
  permission: UserPermission
}) {
  return withAuth(
    async () => {
      // Check if member number already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.member_no, data.member_no))
        .limit(1)

      if (existingUser.length > 0) {
        return {
          error: {
            title: 'Error',
            description: 'A user with this member number already exists.'
          }
        }
      }

      const [createdUser] = await db
        .insert(users)
        .values({
          name: data.name,
          member_no: data.member_no,
          password: '',
          permission: data.permission
        })
        .returning()
      return {
        data: createdUser,
        success: {
          title: 'Success',
          description: 'User created successfully'
        }
      }
    },
    { adminOnly: true }
  )
}

export async function updateUser(
  userId: number,
  data: {
    name?: string
    member_no?: string
  }
) {
  return withAuth(
    async () => {
      if (data.member_no) {
        // Check if member number already exists for a different user
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.member_no, data.member_no))
          .limit(1)

        if (existingUser.length > 0 && existingUser[0].id !== userId) {
          return {
            error: {
              title: 'Error',
              description: 'A user with this member number already exists.'
            }
          }
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, userId))
        .returning()

      return {
        data: updatedUser,
        success: {
          title: 'Success',
          description: 'User updated successfully'
        }
      }
    },
    { adminOnly: true }
  )
}

export async function resetUserPassword(userId: number) {
  return withAuth(
    async () => {
      const [updatedUser] = await db
        .update(users)
        .set({ password: '' })
        .where(eq(users.id, userId))
        .returning()
      return {
        data: updatedUser,
        success: {
          title: 'Success',
          description: 'Password reset successfully'
        }
      }
    },
    { adminOnly: true }
  )
}

export async function changePassword(userId: number, newPassword: string) {
  return withAuth(
    async () => {
      const [updatedUser] = await db
        .update(users)
        .set({ password: await hash(newPassword, 10) })
        .where(eq(users.id, userId))
        .returning()
      return {
        data: updatedUser,
        success: {
          title: 'Success',
          description: 'Password changed successfully'
        }
      }
    },
    { adminOnly: true, allowSelf: true, userId }
  )
}
