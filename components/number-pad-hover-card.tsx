'use client'

import { Button } from '@/components/ui/button'
import { HoverCardContent } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { Delete, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NumberPadHoverCardProps {
  onInput: (value: string) => void
  onBackspace: () => void
  value: string
}

export function NumberPadHoverCard({
  onInput,
  onBackspace,
  value
}: NumberPadHoverCardProps) {
  const [highlightedKey, setHighlightedKey] = useState('')
  const [lastValue, setLastValue] = useState('')

  useEffect(() => {
    // Always trigger highlight animation
    let highlightedKey = value ? value[value.length - 1] : ''
    if (lastValue.length > value.length) {
      highlightedKey = 'Backspace'
    }
    setHighlightedKey(highlightedKey)
    setLastValue(value)
    const timer = setTimeout(() => setHighlightedKey(''), 100)
    return () => clearTimeout(timer)
  }, [value, setHighlightedKey, lastValue, setLastValue])

  return (
    <HoverCardContent
      align="start"
      side="bottom"
      className="w-[384px] h-[240px] p-4 mx-auto"
      avoidCollisions={false}
    >
      <div className="grid grid-cols-3 gap-1 h-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <Button
            variant="outline"
            key={num}
            className={cn(
              'hover:bg-accent transition-colors',
              highlightedKey === String(num) && 'bg-foreground'
            )}
            size="lg"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onInput(String(num))
              document.getElementById('memberNo')?.focus()
            }}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className={cn(
            'hover:bg-destructive transition-colors',
            highlightedKey === 'Backspace' && 'bg-destructive'
          )}
          size="lg"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onBackspace()
            document.getElementById('memberNo')?.focus()
          }}
        >
          <Delete />
        </Button>
        <Button size="lg">
          <LogIn />
        </Button>
      </div>
    </HoverCardContent>
  )
}
