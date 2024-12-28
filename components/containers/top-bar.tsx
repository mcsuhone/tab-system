export const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center bg-background">
      <div className="flex flex-col px-8 pt-12 pb-4 max-w-[800px] w-full gap-2 shadow-lg border-b border-border md:shadow-none md:border-b-0">
        {children}
      </div>
    </div>
  )
}
