import { LoginPageClient } from './page-client'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <LoginPageClient />
      </div>
    </div>
  )
}
