// FILE: src/components/layout/Navbar.jsx
import { Menu, Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-gray-800">Library Management System</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
          <Bell size={20} />
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
            {user?.name?.[0]}
          </div>
          <span className="hidden sm:block font-medium">{user?.name}</span>
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
