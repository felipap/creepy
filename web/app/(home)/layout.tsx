import { LogoutButton } from '@/ui/LogoutButton'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <nav className="p-3 bg-amber-500 dark:bg-amber-950 flex justify-between items-center w-full">
        <div>
          <h1 className="font-medium font-display">
            Your location-tracking server
          </h1>
          <p className="text-sm">
            Visit project on{' '}
            <a
              href="https://github.com/felipap/tracker"
              className="text-contrast font-medium"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div>
          <LogoutButton />
        </div>
      </nav>
      {children}
    </div>
  )
}
