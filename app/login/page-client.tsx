'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, MotionValue } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/app/actions/auth-action'
import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'

export function LoginPageClient() {
  const [memberNo, setMemberNo] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
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

      const success = await login(memberNo, password, rememberMe)

      if (success) {
        setIsExiting(true)
        // Time the navigation to match when logo reaches center
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push('/tab')
      }

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

      toast({
        title: 'Success',
        description: 'Login successful',
        variant: 'default'
      })
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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key="login-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: 'easeInOut',
                delay: 0.2
              }
            }}
            exit={{
              opacity: 0,
              y: -40,
              transition: {
                duration: 0.5,
                ease: 'easeInOut'
              }
            }}
            className="w-full max-w-sm"
          >
            <div className="relative h-32 w-full mb-8">
              <Image
                src="/jalostajat_logo_w.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                  />
                  <Label htmlFor="rememberMe">Remember me</Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
