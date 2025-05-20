export function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-4 pb-6">
        <div className="mx-auto grid w-full max-w-7xl gap-6">{children}</div>
      </main>
    </div>
  )
}
