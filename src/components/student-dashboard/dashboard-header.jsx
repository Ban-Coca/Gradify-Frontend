export function DashboardHeader({ heading, text, children }) {
    return (
      <div className="mt-5 mb-6 bg-gradient-to-r from-primary to-green-400 text-white font-bold text-2xl md:text-4xl p-6 rounded-lg shadow-md mt-4 items-center">
        <div className="grid gap-1">
          <h1>{heading}</h1>
          {text && <p className="text-sm md:text-base font-normal mt-2">{text}</p>}
        </div>
        {children}
      </div>
    )
  }
  