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
import { getUsers, createUser, resetUserPassword } from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'
import { UserPermission } from '@/db/schema'

interface User {
  id: number
  member_no: string
  name: string
  permission: UserPermission
}

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({
    name: '',
    member_no: '',
    permission: 'default' as UserPermission
  })
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
      loadUsers()
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
      <h1 className="mb-8 text-3xl font-bold">User Management</h1>

      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Add New User</h2>
        <form onSubmit={handleCreateUser} className="flex gap-4">
          <Input
            placeholder="Member Number"
            value={newUser.member_no}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, member_no: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <Select
            value={newUser.permission}
            onValueChange={(value: UserPermission) =>
              setNewUser((prev) => ({ ...prev, permission: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Add User</Button>
        </form>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.member_no}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="capitalize">{user.permission}</TableCell>
              <TableCell>
                <Dialog
                  open={isResetDialogOpen && resetUserId === user.id}
                  onOpenChange={(open) => {
                    setIsResetDialogOpen(open)
                    if (!open) setResetUserId(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setResetUserId(user.id)}
                    >
                      Reset Password
                    </Button>
                  </DialogTrigger>
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
    </div>
  )
}
