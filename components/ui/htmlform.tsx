import React, { FormEventHandler, PropsWithChildren } from 'react'

interface HTMLFormProps extends PropsWithChildren {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export const HTMLForm: React.FC<HTMLFormProps> = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={'flex flex-col space-y-4 justify-center items-center mb-30'}
    >
      {children}
    </form>
  )
}
