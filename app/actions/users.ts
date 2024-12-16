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
