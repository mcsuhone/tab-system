export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 flex flex-col items-center w-full h-full overflow-y-hidden my-4">
      <div className="w-full max-w-[800px] px-8 py-4 space-y-4 h-full">
        {children}
      </div>
    </main>
  )
}
