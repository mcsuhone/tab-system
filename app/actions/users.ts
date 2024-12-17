'use server'

import { db } from '@/db/db'
import { users, UserPermission } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

export async function getUsers() {
  try {
    const data = await db.select().from(users)
    return { data }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to fetch users. Please try again.'
      }
    }
  }
}

export async function createUser(data: {
  name: string
  member_no: string
  permission: UserPermission
}) {
  try {
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

    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        member_no: data.member_no,
        password: '',
        permission: data.permission
      })
      .returning()
    return {
      data: user,
      success: {
        title: 'Success',
        description: 'User created successfully'
      }
    }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to create user. Please try again.'
      }
    }
  }
}

export async function updateUser(
  userId: number,
  data: {
    name?: string
    member_no?: string
  }
) {
  try {
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

    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning()

    return {
      data: user,
      success: {
        title: 'Success',
        description: 'User updated successfully'
      }
    }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to update user. Please try again.'
      }
    }
  }
}

export async function resetUserPassword(userId: number) {
  try {
    const [user] = await db
      .update(users)
      .set({ password: '' })
      .where(eq(users.id, userId))
      .returning()
    return {
      data: user,
      success: {
        title: 'Success',
        description: 'Password reset successfully'
      }
    }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to reset password. Please try again.'
      }
    }
  }
}

export async function changePassword(userId: number, newPassword: string) {
  try {
    const [user] = await db
      .update(users)
      .set({ password: await hash(newPassword, 10) })
      .where(eq(users.id, userId))
      .returning()
    return {
      data: user,
      success: {
        title: 'Success',
        description: 'Password changed successfully'
      }
    }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to change password. Please try again.'
      }
    }
  }
}
