import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Performance Evaluation
            </h1>
            <p className="text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-gray-700 mb-2">Ashoka Textiles</p>
                <p className="text-gray-600">Manager: priya@ashoka.com</p>
                <p className="text-gray-600">HR: hr@ashoka.com</p>
                <p className="text-gray-600">Employee: amit@ashoka.com</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-gray-700 mb-2">Bright Path</p>
                <p className="text-gray-600">Founder: sarah@brightpath.com</p>
                <p className="text-gray-600">HR: hr@brightpath.com</p>
                <p className="text-gray-600">Employee: emily@brightpath.com</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Password for all: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
