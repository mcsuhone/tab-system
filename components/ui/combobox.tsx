'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import React from 'react'
import { ValueLabelPair } from '@/types'

interface ComboboxInputProps {
  field: any
  options: ValueLabelPair<string, string>[]
  placeholder_text: string
  empty_text: string
}

export const Combobox: React.FC<ComboboxInputProps> = ({
  field,
  options,
  placeholder_text,
  empty_text
}) => {
  const form = useFormContext()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-[200px] justify-between',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value
              ? options.find((option) => option.value === field.value)?.label
              : placeholder_text}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder={placeholder_text} />
            <CommandEmpty>{empty_text}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    form.setValue(field.name, option.value)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      option.value === field.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
