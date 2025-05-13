export function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-4 pb-6 md:pt-8">
        <div className="mx-auto grid w-full max-w-7xl gap-4 md:gap-8">{children}</div>
      </main>
    </div>
  )
}
