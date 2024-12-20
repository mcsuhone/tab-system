'use server'

import { db } from '@/db/db'
import { measurements, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getMeasurements() {
  try {
    const allMeasurements = await db.select().from(measurements)
    return { data: allMeasurements }
  } catch (error) {
    console.error('Error fetching measurements:', error)
    return {
      error: {
        title: 'Failed to fetch measurements',
        description: 'Please try again later.'
      }
    }
  }
}

export async function addMeasurement(formData: FormData) {
  try {
    const amount = parseFloat(formData.get('amount') as string)
    const unit = formData.get('unit') as string

    if (!amount || !unit) {
      return {
        error: {
          title: 'Invalid input',
          description: 'Amount and unit are required.'
        }
      }
    }

    const newMeasurement = await db
      .insert(measurements)
      .values({
        amount,
        unit
      })
      .returning()

    revalidatePath('/admin/measurements')
    return {
      data: newMeasurement[0],
      success: {
        title: 'Measurement added',
        description: 'The measurement has been added successfully.'
      }
    }
  } catch (error) {
    console.error('Error adding measurement:', error)
    return {
      error: {
        title: 'Failed to add measurement',
        description: 'Please try again later.'
      }
    }
  }
}

export async function deleteMeasurement(id: number) {
  try {
    // Check if measurement is used by any products
    const productsUsingMeasurement = await db
      .select()
      .from(products)
      .where(eq(products.measureId, id))

    if (productsUsingMeasurement.length > 0) {
      return {
        error: {
          title: 'Cannot delete measurement',
          description: 'This measurement is being used by one or more products.'
        }
      }
    }

    await db.delete(measurements).where(eq(measurements.id, id))

    revalidatePath('/admin/measurements')
    return {
      success: {
        title: 'Measurement deleted',
        description: 'The measurement has been deleted successfully.'
      }
    }
  } catch (error) {
    console.error('Error deleting measurement:', error)
    return {
      error: {
        title: 'Failed to delete measurement',
        description: 'Please try again later.'
      }
    }
  }
}
