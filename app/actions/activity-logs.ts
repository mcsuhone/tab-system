'use server'

import { db } from '@/db/db'
import { activityLogs, users } from '@/db/schema'
import { and, between, eq } from 'drizzle-orm'

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
      conditions.push(between(activityLogs.createdAt, startDate, endDate))
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
        type: activityLogs.type,
        userId: activityLogs.userId,
        createdAt: activityLogs.createdAt,
        memberNo: users.member_no,
        userName: users.name
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(activityLogs.createdAt)

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