'use client'
import '@/styles/globals.css'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { User } from '@prisma/client'
import { useEffect, useState } from 'react'
import { HTMLForm } from '@/components/ui/htmlform'

const formSchema = z.object({
  user_id: z.string().min(1).max(3),
  name: z.string()
})

export default function Home() {
  const [users, setUsers] = useState<User[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: '',
      name: ''
    }
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        const foundUsers: User[] = await response.json()
        setUsers(foundUsers)
      }
    }
    fetchUsers()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    if (response.status === 200) {
      const foundUser: User = await response.json()
      setUsers([...users, foundUser])
    }
  }

  return (
    <>
      <h2 className="text-4xl p-10">Lisää käyttäjä</h2>
      <Form {...form}>
        <HTMLForm onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jäsen nro</FormLabel>
                <FormControl>
                  <Input placeholder="***" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nimi</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Lisää käyttäjä</Button>
        </HTMLForm>
      </Form>
      <div className="mt-8">
        <h2>Users</h2>
        {users.map((user) => (
          <div key={user.id}>
            <p>
              {user.id} - {user.name}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
