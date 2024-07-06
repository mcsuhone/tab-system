import React, { FormEventHandler } from 'react'

interface HTMLFormProps {
  children: React.ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
}

export const HTMLForm: React.FC<HTMLFormProps> = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={'flex flex-col space-y-2 justify-center items-center mb-30'}
    >
      {children}
    </form>
  )
}
