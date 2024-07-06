'use client'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  user_id: z.string().min(1).max(3)
})

export default function Home() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch(`/api/users/${values.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      const foundUser: User = await response.json()
      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser))
        router.push('/tab')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="text-3xl p-14">Tervetuloa piikkiin</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 items-center"
        >
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Käyttäjä</FormLabel>
                <FormControl>
                  <Input placeholder="***" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Kirjaudu sisään</Button>
        </form>
      </Form>
    </main>
  )
}
