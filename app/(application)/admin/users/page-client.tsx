'use client'

import { getAdminProducts } from '@/app/actions/products'
import { resetUserPassword } from '@/app/actions/users'
import { useUsers } from '@/app/hooks/use-users'
import { LoadingContainer } from '@/components/containers/loading-container'
import { TableRowMotion } from '@/components/containers/table-row-motion'
import { SearchBar } from '@/components/product/search-bar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Product } from '@/db/schema'
import { AdminUser } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { cn } from '@/lib/utils'
import {
  ArrowDown,
  ArrowUp,
  HandCoins,
  KeyRound,
  MoreHorizontal,
  Pencil
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { AdminMoneyDialog } from './admin-money-dialog'
import { AddUserDialog, EditUserDialog } from './user-dialogs'

type SortDirection = 'asc' | 'desc' | null

interface BalanceSortButtonProps {
  currentSort: SortDirection
  onChange: (sort: SortDirection) => void
}

function BalanceSortButton({ currentSort, onChange }: BalanceSortButtonProps) {
  const handleClick = () => {
    let nextSort: SortDirection
    if (currentSort === null) {
      nextSort = 'asc' // None -> Asc (Negative first)
    } else if (currentSort === 'asc') {
      nextSort = 'desc' // Asc -> Desc (Positive first)
    } else {
      nextSort = null // Desc -> None (Default)
    }
    onChange(nextSort)
  }

  return (
    <Button variant="outline" onClick={handleClick} className="shrink-0">
      Sort by Balance
      {currentSort === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
      {currentSort === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
    </Button>
  )
}

export default function UsersPage() {
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [resetUserId, setResetUserId] = useState<number | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [moneyDialogUser, setMoneyDialogUser] = useState<AdminUser | null>(null)
  const [search, setSearch] = useState('')
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchAdminProducts() {
      const result = await getAdminProducts()
      if (
        result.success &&
        result.data &&
        Array.isArray(result.data.products)
      ) {
        setAdminProducts(result.data.products)
      }
    }
    fetchAdminProducts()
  }, [])

  const {
    users,
    isLoading,
    isLoadingMore,
    hasMore,
    refetch: loadData,
    fetchNextPage
  } = useUsers({ query: search, limit: 30, sortDirection })

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrolledToBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100

    if (scrolledToBottom && hasMore && !isLoadingMore) {
      fetchNextPage()
    }
  }

  async function handleResetPassword() {
    if (!resetUserId) return

    const result = await resetUserPassword(resetUserId)
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else {
      toast({
        title: result.data.success?.title,
        description: result.data.success?.description
      })
    }
    setIsResetDialogOpen(false)
    setResetUserId(null)
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-8 flex justify-between items-center">
        <h1 className="ml-12 md:ml-0 text-2xl md:text-3xl font-bold">
          User Management
        </h1>
        <AddUserDialog onSuccess={loadData} />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="sticky top-1 ml-1 bg-background z-10 pb-4 flex gap-2">
          <SearchBar
            value={search}
            onSearch={setSearch}
            placeholder="Search users..."
            className="flex-grow"
          />
          <BalanceSortButton
            currentSort={sortDirection}
            onChange={setSortDirection}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : users.length > 0 ? (
          <div
            className={cn('h-full overflow-y-auto', scrollbarStyles)}
            onScroll={handleScroll}
            ref={contentRef}
          >
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Member #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRowMotion key={user.id} index={index}>
                    <TableCell>{user.member_no}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="capitalize">
                      {user.permission}
                    </TableCell>
                    <TableCell
                      className={`$${
                        user.balance < -50 ? 'text-red-500 font-medium' : ''
                      }`}
                    >
                      {user.balance.toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setMoneyDialogUser(user)}
                          >
                            <HandCoins className="mr-2 h-4 w-4" />
                            Modify Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setResetUserId(user.id)
                              setIsResetDialogOpen(true)
                            }}
                          >
                            <KeyRound className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRowMotion>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={() => {
            loadData()
            setEditingUser(null)
          }}
        />
      )}

      {moneyDialogUser && (
        <AdminMoneyDialog
          user={moneyDialogUser}
          open={!!moneyDialogUser}
          onOpenChange={(open) => !open && setMoneyDialogUser(null)}
          onSuccess={loadData}
          adminProducts={adminProducts}
        />
      )}

      {resetUserId && (
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset User Password</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset the password for{' '}
                {users.find((u) => u.id === resetUserId)?.name}? The password
                will be cleared and the user will need to set a new password on
                their next login.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetPassword}>
                Reset Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isLoadingMore && (
        <LoadingContainer isLoading={isLoadingMore}>
          <div />
        </LoadingContainer>
      )}
    </div>
  )
}
