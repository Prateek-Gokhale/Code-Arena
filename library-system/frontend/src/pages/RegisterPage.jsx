import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Library, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Library size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join and start purchasing books</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className={`input ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" className={`input ${errors.email ? 'border-red-400' : ''}`} {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" className={`input ${errors.password ? 'border-red-400' : ''}`} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Phone (optional)</label>
                <input className="input" {...register('phone')} />
              </div>
              <div>
                <label className="label">Address (optional)</label>
                <input className="input" {...register('address')} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-base">
              <span className="flex items-center gap-2">
                <UserPlus size={18} />
                {loading ? 'Creating Account...' : 'Create Account'}
              </span>
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-5 text-center">
            Already have an account?{' '}
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
