'use client'

import { CartButton } from '@/components/cart/cart-button'
import { User } from '@/db/schema'
import UserInfo from '../user-info'

export const TopBar = ({ user }: { user: User | null }) => {
  return (
    <div className="sticky top-0 flex justify-between bg-background">
      <div className="flex flex-col px-8 pt-12 pb-4 justify-between w-full gap-2 shadow-lg border-b border-border md:shadow-none md:border-b-0">
        <UserInfo user={user} />

        <div className="flex flex-row justify-end">
          <CartButton />
        </div>
      </div>
    </div>
  )
}
