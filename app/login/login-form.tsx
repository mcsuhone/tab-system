'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/app/actions/auth-action'

export function LoginForm() {
  const [memberNo, setMemberNo] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!memberNo) {
        toast({
          title: 'Error',
          description: 'Member number is required',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      const success = await login(memberNo, password)

      if (!success) {
        toast({
          title: 'Error',
          description:
            'Login failed. Please check your member number and password.',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      router.refresh()
      router.push('/tab')
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="memberNo">Member Number</Label>
          <Input
            id="memberNo"
            type="text"
            value={memberNo}
            onChange={(e) => setMemberNo(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
