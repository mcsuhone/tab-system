import { Skeleton } from '@/components/ui/skeleton'

export function ProductSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 rounded-lg border mb-2.5"
        >
          <div className="flex-[50%]">
            <Skeleton className="h-4 w-[180px]" />
          </div>
          <div className="flex-[15%]">
            <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="flex-[25%] flex justify-center">
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="flex-[10%] flex justify-end">
            <Skeleton className="h-4 w-[40px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
