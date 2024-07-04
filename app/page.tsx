import { Input } from '@/components/ui/input'
import db from '@/modules/db'

export default function Home() {
  const addUser = async () => {
    'use server'
    const user = await db.user.create({
      data: {
        id: 155,
        name: 'Mikko'
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="text-4xl p-14">Welcome to tab</h2>
      <Input className="w-300 text-center" placeholder="Enter code" />
    </main>
  )
}
