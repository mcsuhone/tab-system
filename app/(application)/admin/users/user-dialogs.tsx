'use client'

import { createUser, updateUser } from '@/app/actions/users'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AdminUser, UserPermission } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export function EditUserDialog({
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

export function AddUserDialog({ onSuccess }: { onSuccess: () => void }) {
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
