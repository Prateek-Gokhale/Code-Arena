// FILE: src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/dashboardApi'
import StatCard from '../components/ui/StatCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { BookOpen, Users, BookMarked, AlertTriangle, BookCheck, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

function StatusBadge({ status }) {
  const map = {
    ACTIVE:   'badge-blue',
    RETURNED: 'badge-green',
    OVERDUE:  'badge-red',
  }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Library overview and recent activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard title="Total Books"      value={stats?.totalBooks}      icon={BookOpen}       color="blue"   />
        <StatCard title="Total Members"    value={stats?.totalMembers}    icon={Users}          color="purple" />
        <StatCard title="Active Borrows"   value={stats?.activeBorrows}   icon={BookMarked}     color="green"  />
        <StatCard title="Overdue Books"    value={stats?.overdueBooks}    icon={AlertTriangle}  color="red"    />
        <StatCard title="Available Books"  value={stats?.availableBooks}  icon={BookCheck}      color="green"  subtitle="Currently on shelf" />
        <StatCard title="Reservations"     value={stats?.totalReservations} icon={TrendingUp}   color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top borrowed books */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Most Borrowed Books</h3>
          {stats?.topBorrowedBooks?.length ? (
            <ol className="space-y-3">
              {stats.topBorrowedBooks.map((book, i) => (
                <li key={book.bookId} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 truncate">{book.author}</p>
                  </div>
                  <span className="badge-blue badge shrink-0">{book.borrowCount} borrows</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No borrow data yet</p>
          )}
        </div>

        {/* Overdue list */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Overdue Books
          </h3>
          {stats?.overdueList?.length ? (
            <div className="space-y-3">
              {stats.overdueList.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-start justify-between gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.bookTitle}</p>
                    <p className="text-xs text-gray-500">{b.userName}</p>
                    <p className="text-xs text-red-600 font-medium mt-0.5">
                      Due: {new Date(b.dueDate).toLocaleDateString('en-IN')} · {b.overdueDays}d overdue
                    </p>
                  </div>
                  <span className="badge-red badge shrink-0">₹{b.fine?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-600 text-center py-6 font-medium">No overdue books 🎉</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentActivity?.length ? stats.recentActivity.map(r => (
                <tr key={r.id}>
                  <td className="font-medium max-w-[180px] truncate">{r.bookTitle}</td>
                  <td className="text-gray-600">{r.userName}</td>
                  <td className="text-gray-500">{new Date(r.issueDate).toLocaleDateString('en-IN')}</td>
                  <td className="text-gray-500">{new Date(r.dueDate).toLocaleDateString('en-IN')}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className={r.fine > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>
                    {r.fine > 0 ? `₹${r.fine.toFixed(2)}` : '—'}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8">No recent activity</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
