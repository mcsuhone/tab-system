export const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-none w-full justify-center">
      <div className="flex flex-col w-full px-8 pt-16 pb-4 max-w-[800px] gap-2 shadow-lg border-b border-border md:shadow-none md:border-b-0">
        {children}
      </div>
    </div>
  )
}
