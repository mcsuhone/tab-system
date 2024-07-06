import React, { PropsWithChildren } from 'react'

export const FormHeader: React.FC<PropsWithChildren> = (
  { children },
  props
) => {
  return (
    <h2 {...props} className="text-4xl p-10">
      {children}
    </h2>
  )
}
