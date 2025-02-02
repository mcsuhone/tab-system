'use client'

import { getAdminProducts } from '@/app/actions/products'
import { createAdminTransaction } from '@/app/actions/transactions'
import { createUser, resetUserPassword, updateUser } from '@/app/actions/users'
import { useUsers } from '@/app/hooks/use-users'
import { LoadingContainer } from '@/components/containers/loading-container'
import PriceInput from '@/components/input/price-input'
import { SearchBar } from '@/components/product/search-bar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Product, UserPermission } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { HandCoins, KeyRound, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface AdminUser {
  id: number
  member_no: string
  name: string
  permission: UserPermission
  balance: number
}

interface AdminMoneyDialog {
  user: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  adminProducts: Product[]
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}: {
  user: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: AdminUser) => void
}) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user.name,
    member_no: user.member_no
  })

  useEffect(() => {
    setFormData({
      name: user.name,
      member_no: user.member_no
    })
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await updateUser(user.id, formData)
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else if (result.data) {
      toast({
        title: result.data.success?.title,
        description: result.data.success?.description
      })
      onSuccess(result.data.data as AdminUser)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Note that member number must be unique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Input
                placeholder="Member Number"
                value={formData.member_no}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    member_no: e.target.value
                  }))
                }
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddUserDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const [newUser, setNewUser] = useState({
    name: '',
    member_no: '',
    permission: 'default' as UserPermission
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    const result = await createUser(newUser)
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
      setNewUser({ name: '', member_no: '', permission: 'default' })
      setDialogOpen(false)
      onSuccess()
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will need to set their password
            on first login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Input
                placeholder="Member Number"
                value={newUser.member_no}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, member_no: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Select
                value={newUser.permission}
                onValueChange={(value: UserPermission) =>
                  setNewUser((prev) => ({ ...prev, permission: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AdminMoneyDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
  adminProducts
}: AdminMoneyDialog) {
  const { toast } = useToast()
  const [amount, setAmount] = useState('0')
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  useEffect(() => {
    if (adminProducts.length > 0) {
      setSelectedProduct(adminProducts[0].id)
    }
  }, [adminProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const result = await createAdminTransaction({
      userId: user.id,
      productId: selectedProduct,
      amount: parseFloat(amount)
    })

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
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Balance</DialogTitle>
          <DialogDescription>
            Add or subtract money from {user.name}&apos;s balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Select
                value={selectedProduct?.toString()}
                onValueChange={(value) => setSelectedProduct(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {adminProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2">
              <PriceInput price={amount} onPriceChange={setAmount} min="0" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!selectedProduct}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
  } = useUsers({ query: search, limit: 30 })

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
        <h1 className="text-3xl font-bold">User Management</h1>
        <AddUserDialog onSuccess={loadData} />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
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
            <div className="sticky top-1 ml-1 bg-background z-10 pb-4">
              <SearchBar onSearch={setSearch} placeholder="Search users..." />
            </div>
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
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.15,
                      ease: 'easeOut'
                    }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>{user.member_no}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="capitalize">
                      {user.permission}
                    </TableCell>
                    <TableCell
                      className={`${
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

                      <Dialog
                        open={isResetDialogOpen && resetUserId === user.id}
                        onOpenChange={(open) => {
                          setIsResetDialogOpen(open)
                          if (!open) setResetUserId(null)
                        }}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset User Password</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reset the password for{' '}
                              {user.name}? The password will be cleared and the
                              user will need to set a new password on their next
                              login.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsResetDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleResetPassword}
                            >
                              Reset Password
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </motion.tr>
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

      {isLoadingMore && (
        <LoadingContainer isLoading={isLoadingMore}>
          <div />
        </LoadingContainer>
      )}
    </div>
  )
}
