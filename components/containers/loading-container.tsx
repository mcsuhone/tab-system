export const LoadingContainer = ({
  children,
  isLoading
}: {
  children: React.ReactNode
  isLoading: boolean
}) => {
  return (
    <div className="flex justify-center items-center h-full">
      {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-200" />
      ) : (
        children
      )}
    </div>
  )
}
