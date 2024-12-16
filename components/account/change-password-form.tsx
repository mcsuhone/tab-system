'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { changePassword } from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'

interface ChangePasswordFormProps {
  userId: number
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const { toast } = useToast()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match'
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password must be at least 6 characters long'
      })
      return
    }

    setIsLoading(true)
    const { error, success } = await changePassword(userId, newPassword)
    setIsLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: error.title,
        description: error.description
      })
    } else {
      toast({
        title: success?.title,
        description: success?.description
      })
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
  )
}
