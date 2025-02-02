interface LoadingContainerProps {
  children: React.ReactNode
  isLoading: boolean
  className?: string
}

export function LoadingContainer({
  children,
  isLoading,
  className
}: LoadingContainerProps) {
  return (
    <div
      className={`flex justify-center items-center h-full ${className || ''}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-200" />
      ) : (
        children
      )}
    </div>
  )
}
