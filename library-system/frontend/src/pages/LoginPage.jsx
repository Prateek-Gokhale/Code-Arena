// FILE: src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Library, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot reach API server. Please check backend deployment.')
      } else if (err.response.status === 404) {
        toast.error('Login API not found. Backend is not deployed yet.')
      } else {
        toast.error(err.response?.data?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (email, password) => {
    setValue('email', email)
    setValue('password', password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Library size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BookNest AI</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="you@library.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={18} /> Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Quick login buttons */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Login (Demo)</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Admin',     email: 'admin@library.com',     pw: 'Admin@123',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Librarian', email: 'librarian@library.com', pw: 'Lib@123',    color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { label: 'Member',    email: 'member@library.com',    pw: 'Member@123', color: 'bg-green-50 text-green-700 border-green-200' },
            ].map(({ label, email, pw, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => fillCredentials(email, pw)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:opacity-80 ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          New user?{' '}
          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/register')}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  )
}
