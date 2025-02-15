'use client'

import { login } from '@/app/actions/auth-action'
import { NumberPadHoverCard } from '@/components/number-pad-hover-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginPageClient() {
  const [memberNo, setMemberNo] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isNumberPadOpen, setIsNumberPadOpen] = useState(false)
  const isMobile = useIsMobile()
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
        await new Promise((resolve) => setTimeout(resolve, 200))
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

  const handleNumberInput = (num: string) => {
    setMemberNo((prev) => prev + num)
  }

  const handleBackspace = () => {
    setMemberNo((prev) => prev.slice(0, -1))
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      {/* Static logo outside AnimatePresence */}
      <div className="relative h-32 w-full mb-8">
        <Image
          src="/jalostajat_logo_w.png"
          alt="OJS Logo"
          priority
          fill
          className="object-contain"
        />
      </div>

      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key="login-form"
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
                duration: 0.35,
                ease: 'easeInOut'
              }
            }}
            className="w-full max-w-sm px-8 md:px-0"
          >
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
                  {!isMobile && (
                    <HoverCard open={isNumberPadOpen} openDelay={0.2}>
                      <HoverCardTrigger asChild>
                        <div className="relative">
                          <Input
                            id="memberNo"
                            type="number"
                            value={memberNo}
                            autoComplete="off"
                            onFocus={() => setIsNumberPadOpen(true)}
                            onBlur={(e) => {
                              if (!e.currentTarget.contains(e.relatedTarget)) {
                                setIsNumberPadOpen(false)
                              }
                            }}
                            onChange={(e) => setMemberNo(e.target.value)}
                            disabled={isLoading}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const inputs = Array.from(
                                  document.querySelectorAll('input')
                                )
                                const index = inputs.indexOf(e.currentTarget)
                                if (index > -1 && inputs[index + 1]) {
                                  inputs[index + 1].focus()
                                }
                                setIsNumberPadOpen(false)
                              }
                            }}
                          />
                        </div>
                      </HoverCardTrigger>
                      <NumberPadHoverCard
                        onInput={handleNumberInput}
                        onBackspace={handleBackspace}
                        value={memberNo}
                      />
                    </HoverCard>
                  )}
                  {isMobile && (
                    <Input
                      id="memberNo"
                      type="number"
                      value={memberNo}
                      autoComplete="off"
                      onFocus={() => setIsNumberPadOpen(true)}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setIsNumberPadOpen(false)
                        }
                      }}
                      onChange={(e) => setMemberNo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const inputs = Array.from(
                            document.querySelectorAll('input')
                          )
                          const index = inputs.indexOf(e.currentTarget)
                          if (index > -1 && inputs[index + 1]) {
                            inputs[index + 1].focus()
                          }
                          setIsNumberPadOpen(false)
                        }
                      }}
                      disabled={isLoading}
                    />
                  )}
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
                <LogIn />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
