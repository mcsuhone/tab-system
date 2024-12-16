import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
