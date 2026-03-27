// FILE: src/pages/ProfilePage.jsx
import { useAuth } from '../features/auth/AuthContext'
import { User, Mail, Shield, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700',
    LIBRARIAN: 'bg-blue-100 text-blue-700',
    MEMBER: 'bg-green-100 text-green-700',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Your account details</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
            <span className={`badge mt-1 ${roleColors[user?.role] || 'badge-gray'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <User size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Full Name</p>
              <p className="text-sm text-gray-900 font-medium mt-0.5">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Mail size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Address</p>
              <p className="text-sm text-gray-900 font-medium mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Role</p>
              <p className="text-sm text-gray-900 font-medium mt-0.5 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">User ID</p>
              <p className="text-sm text-gray-900 font-medium mt-0.5">#{user?.userId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-100">
        <h4 className="font-semibold text-blue-900 mb-2">Access Level</h4>
        <p className="text-sm text-blue-700">
          {user?.role === 'ADMIN' && 'You have full administrative access: manage books, members, view all reports and control all system settings.'}
          {user?.role === 'LIBRARIAN' && 'You can issue/return books, manage borrows and reservations, and view member details.'}
          {user?.role === 'MEMBER' && 'You can browse the book catalog, view your borrow history, and make reservations.'}
        </p>
      </div>
    </div>
  )
}
