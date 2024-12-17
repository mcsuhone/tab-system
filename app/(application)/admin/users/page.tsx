'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  getUsers,
  createUser,
  resetUserPassword,
  updateUser
} from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'
import { UserPermission } from '@/db/schema'
import { Plus, MoreHorizontal, Pencil, KeyRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface User {
  id: number
  member_no: string
  name: string
  permission: UserPermission
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}: {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: User) => void
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
    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else if (result.data) {
      toast({
        title: result.success?.title,
        description: result.success?.description
      })
      onSuccess(result.data)
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
    const { data, error, success } = await createUser(newUser)
    if (error) {
      toast({
        variant: 'destructive',
        title: error.title,
        description: error.description
      })
    } else {
      toast({
        title: success?.title,
        description: success?.description
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
          <Plus className="mr-2 h-4 w-4" />
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

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [resetUserId, setResetUserId] = useState<number | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data, error } = await getUsers()
    if (error) {
      toast({
        variant: 'destructive',
        title: error.title,
        description: error.description
      })
    } else if (data) {
      setUsers(data)
    }
  }

  async function handleResetPassword() {
    if (!resetUserId) return

    const { error, success } = await resetUserPassword(resetUserId)
    if (error) {
      toast({
        variant: 'destructive',
        title: error.title,
        description: error.description
      })
    } else {
      toast({
        title: success?.title,
        description: success?.description
      })
    }
    setIsResetDialogOpen(false)
    setResetUserId(null)
  }

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <AddUserDialog onSuccess={loadUsers} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.member_no}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="capitalize">{user.permission}</TableCell>
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
                    <DropdownMenuItem onClick={() => setEditingUser(user)}>
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
                        {user.name}? The password will be cleared and the user
                        will need to set a new password on their next login.
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
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={(updatedUser) => {
            setUsers(
              users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            )
          }}
        />
      )}
    </div>
  )
}
