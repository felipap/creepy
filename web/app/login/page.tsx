'use server'

import { authenticate, isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  // If already authenticated, redirect to protected page

  if (await isAuthenticated()) {
    redirect('/protected')
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1>Felipe&apos;s tracking server.</h1>
        <p>
          <a href="https://github.com/felipap/tracker" className="text-link">
            GitHub
          </a>
        </p>
      </header>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

function LoginForm() {
  async function handleSubmit(formData: FormData) {
    'use server'

    const password = formData.get('password') as string

    if (await authenticate(password)) {
      redirect('/')
    } else {
      redirect('/login?error=invalid')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter website secret"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login
      </button>
    </form>
  )
}
