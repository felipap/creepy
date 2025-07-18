import { LogoutButton } from '@/ui/LogoutButton'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <nav className="p-3 bg-amber-50 dark:bg-amber-950 flex justify-between items-center w-full">
        <div>
          <h1>Felipe&apos;s creepy tracking server</h1>
          <p>
            See{' '}
            <a href="https://github.com/felipap/tracker" className="text-link">
              GitHub
            </a>
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
