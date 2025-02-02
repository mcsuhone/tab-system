'use server'

import { db } from '@/db/db'
import { activityLogs, users } from '@/db/schema'
import { and, between, eq, desc } from 'drizzle-orm'

export type ActivityLogFilters = {
  startDate?: Date
  endDate?: Date
  memberNo?: string
}

export async function getActivityLogs({
  startDate,
  endDate,
  memberNo
}: ActivityLogFilters = {}) {
  try {
    const conditions = []

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1)
      conditions.push(
        between(activityLogs.createdAt, startDate, adjustedEndDate)
      )
    }

    if (memberNo) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.member_no, memberNo))
        .limit(1)

      if (user[0]) {
        conditions.push(eq(activityLogs.userId, user[0].id))
      }
    }

    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        userId: activityLogs.userId,
        createdAt: activityLogs.createdAt,
        memberNo: users.member_no,
        userName: users.name
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activityLogs.createdAt))

    return { data: logs }
  } catch (error) {
    return {
      error: {
        title: 'Error',
        description: 'Failed to fetch activity logs. Please try again.'
      }
    }
  }
}

export async function exportActivityLogs(filters: ActivityLogFilters = {}) {
  const result = await getActivityLogs(filters)
  if (!result.data) return null
  return result.data
}

function flattenDetails(details: unknown): Record<string, unknown> {
  if (typeof details === 'string') {
    try {
      // Attempt to parse stringified JSON
      details = JSON.parse(details)
    } catch {
      return { details } // Return as-is if not parseable
    }
  }

  if (details && typeof details === 'object' && !Array.isArray(details)) {
    const flattened: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(details)) {
      // Handle nested objects recursively if needed
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          flattened[`details_${key}_${subKey}`] = subValue
        })
      } else {
        flattened[`details_${key}`] = value
      }
    }
    return flattened
  }

  return { details } // Fallback for arrays/primitives
}

export async function getExportData(filters: ActivityLogFilters = {}) {
  const result = await getActivityLogs(filters)
  if (!result.data) return null

  return result.data.map((log) => ({
    timestamp: log.createdAt,
    action: log.action,
    member_number: log.memberNo,
    user_name: log.userName,
    ...flattenDetails(log.details)
  }))
}
