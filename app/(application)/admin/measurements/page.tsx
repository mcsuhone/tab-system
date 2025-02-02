'use client'

import {
  addMeasurement,
  deleteMeasurement,
  getMeasurements
} from '@/app/actions/measurements'
import { LoadingContainer } from '@/components/containers/loading-container'
import { TableRowMotion } from '@/components/containers/table-row-motion'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Measurement } from '@/db/schema'
import { useToast } from '@/hooks/use-toast'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

function AddMeasurementDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    unit: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = new FormData()
    form.append('amount', formData.amount)
    form.append('unit', formData.unit)

    const result = await addMeasurement(form)
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else {
      toast({
        title: 'Success',
        description: 'Measurement added successfully'
      })
      setFormData({ amount: '', unit: '' })
      setDialogOpen(false)
      onSuccess()
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="m-1">
          <Plus className="h-4 w-4" />
          Add Measurement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Measurement</DialogTitle>
          <DialogDescription>
            Add a new measurement unit for products.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Input
                placeholder="Unit (e.g., cl, dl, ml)"
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add Measurement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function MeasurementsPage() {
  const { toast } = useToast()
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [measurementToDelete, setMeasurementToDelete] =
    useState<Measurement | null>(null)

  const loadMeasurements = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getMeasurements()
      if (error) {
        toast({
          variant: 'destructive',
          title: error.title,
          description: error.description
        })
      } else if (data) {
        setMeasurements(data)
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadMeasurements()
  }, [loadMeasurements])

  async function handleDelete(measurement: Measurement) {
    const result = await deleteMeasurement(measurement.id)
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: result.error.title,
        description: result.error.description
      })
    } else {
      toast({
        title: 'Success',
        description: 'Measurement deleted successfully'
      })
      loadMeasurements()
    }
    setMeasurementToDelete(null)
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Sticky header section */}
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="shrink-0 mb-8 flex justify-between items-center">
          <h1 className="ml-12 md:ml-0 text-2xl md:text-3xl font-bold">
            Measurement Management
          </h1>
          <AddMeasurementDialog onSuccess={loadMeasurements} />
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <LoadingContainer isLoading={isLoading} className="h-full">
          <div className={cn('w-full h-full overflow-y-auto', scrollbarStyles)}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Display</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map((measurement, index) => (
                  <TableRowMotion key={measurement.id} index={index}>
                    <TableCell>{measurement.amount}</TableCell>
                    <TableCell>{measurement.unit}</TableCell>
                    <TableCell>
                      {measurement.amount} {measurement.unit}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMeasurementToDelete(measurement)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRowMotion>
                ))}
              </TableBody>
            </Table>
          </div>
        </LoadingContainer>
      </div>

      <Dialog
        open={!!measurementToDelete}
        onOpenChange={(open) => !open && setMeasurementToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Measurement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the measurement &quot;
              {measurementToDelete?.amount} {measurementToDelete?.unit}&quot;?
              This action cannot be undone if the measurement is not in use.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMeasurementToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                measurementToDelete && handleDelete(measurementToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
