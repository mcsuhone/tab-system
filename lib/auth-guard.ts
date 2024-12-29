import { auth } from './auth'
import type { User } from '@/db/schema'

interface SuccessResult<T> {
  success: true
  user: User
  data: T
}

interface ErrorResult {
  success: false
  error: {
    title: string
    description: string
  }
}

type AuthResult<T> = SuccessResult<T> | ErrorResult

export async function withAuth<T>(
  handler: (user: User) => Promise<T>,
  options?: {
    adminOnly?: boolean
    allowSelf?: boolean
    userId?: number
  }
): Promise<AuthResult<T>> {
  try {
    const { user } = await auth()

    if (!user) {
      return {
        success: false,
        error: {
          title: 'Unauthorized',
          description: 'You must be logged in to perform this action.'
        }
      }
    }

    // Check admin permission if required
    if (options?.adminOnly && user.permission !== 'admin') {
      // If allowSelf is true and userId matches the current user, allow the action
      if (options?.allowSelf && options?.userId === user.id) {
        // Continue with the action
      } else {
        return {
          success: false,
          error: {
            title: 'Unauthorized',
            description: 'You do not have permission to perform this action.'
          }
        }
      }
    }

    const data = await handler(user)
    return {
      success: true,
      user,
      data
    }
  } catch (error) {
    console.error('Auth guard error:', error)
    return {
      success: false,
      error: {
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      }
    }
  }
}
