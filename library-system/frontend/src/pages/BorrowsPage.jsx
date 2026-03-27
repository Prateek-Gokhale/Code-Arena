// FILE: src/pages/BorrowsPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { borrowsApi } from '../api/borrowsApi'
import { booksApi } from '../api/booksApi'
import { membersApi } from '../api/membersApi'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, RotateCcw, AlertTriangle, BookMarked, CheckCircle } from 'lucide-react'

const TABS = ['All', 'Active', 'Overdue', 'Returned']

function StatusBadge({ status }) {
  const map = { ACTIVE: 'badge-blue', RETURNED: 'badge-green', OVERDUE: 'badge-red' }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

function IssueForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    booksApi.getAll({ size: 100 }).then(r => setBooks(r.data.data.content.filter(b => b.available)))
    membersApi.getAll({ size: 100 }).then(r => setMembers(r.data.data.content.filter(m => m.active && m.role === 'MEMBER')))
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Select Book *</label>
        <select className={`input ${errors.bookId ? 'border-red-400' : ''}`} {...register('bookId', { required: 'Required', valueAsNumber: true })}>
          <option value="">— Choose available book —</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title} by {b.author} ({b.availableCopies} left)</option>)}
        </select>
        {errors.bookId && <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>}
      </div>
      <div>
        <label className="label">Select Member *</label>
        <select className={`input ${errors.userId ? 'border-red-400' : ''}`} {...register('userId', { required: 'Required', valueAsNumber: true })}>
          <option value="">— Choose member —</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
        </select>
        {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
      </div>
      <div>
        <label className="label">Notes (optional)</label>
        <textarea className="input resize-none h-16" {...register('notes')} placeholder="Any special notes…" />
      </div>
      <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
        📅 Due date will be set to <strong>14 days</strong> from today. Fine is <strong>₹5/day</strong> after due date.
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Issuing…' : <><BookMarked size={16} /> Issue Book</>}
        </button>
      </div>
    </form>
  )
}

export default function BorrowsPage() {
  const [borrows, setBorrows] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [showIssue, setShowIssue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [returnTarget, setReturnTarget] = useState(null)

  const fetchBorrows = useCallback(() => {
    setLoading(true)
    const params = { page, size: 10 }
    let req
    if (activeTab === 'Overdue') req = borrowsApi.getOverdue(params)
    else req = borrowsApi.getAll({ ...params, status: activeTab === 'All' ? undefined : activeTab })
    req.then(res => {
        const data = res.data.data
        setBorrows(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => toast.error('Failed to fetch borrows'))
      .finally(() => setLoading(false))
  }, [page, activeTab])

  useEffect(() => { fetchBorrows() }, [fetchBorrows])
  useEffect(() => { setPage(0) }, [activeTab])

  const handleIssue = async (data) => {
    setSaving(true)
    try {
      await borrowsApi.issue(data)
      toast.success('Book issued successfully!')
      setShowIssue(false)
      fetchBorrows()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book')
    } finally { setSaving(false) }
  }

  const handleReturn = async () => {
    try {
      const res = await borrowsApi.returnBook(returnTarget.id)
      const fine = res.data.data.fine
      if (fine > 0) toast.success(`Book returned. Fine: ₹${fine.toFixed(2)}`, { duration: 5000 })
      else toast.success('Book returned successfully!')
      fetchBorrows()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Borrows</h2>
          <p className="text-gray-500 text-sm mt-1">Manage book issues and returns</p>
        </div>
        <button className="btn-primary" onClick={() => setShowIssue(true)}>
          <Plus size={16} /> Issue Book
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'Overdue' && <AlertTriangle size={14} className="text-red-500" />}
            {tab === 'Active' && <BookMarked size={14} className="text-blue-500" />}
            {tab === 'Returned' && <CheckCircle size={14} className="text-green-500" />}
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.length ? borrows.map(b => (
                    <tr key={b.id} className={b.status === 'OVERDUE' ? 'bg-red-50/50' : ''}>
                      <td>
                        <div>
                          <p className="font-medium text-gray-900 max-w-[140px] truncate">{b.bookTitle}</p>
                          <p className="text-xs text-gray-400 font-mono">{b.bookIsbn}</p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="text-sm font-medium">{b.userName}</p>
                          <p className="text-xs text-gray-400">{b.userEmail}</p>
                        </div>
                      </td>
                      <td className="text-sm text-gray-600">{new Date(b.issueDate).toLocaleDateString('en-IN')}</td>
                      <td className={`text-sm font-medium ${b.status === 'OVERDUE' ? 'text-red-600' : 'text-gray-600'}`}>
                        {new Date(b.dueDate).toLocaleDateString('en-IN')}
                        {b.overdueDays > 0 && <span className="block text-xs text-red-500">{b.overdueDays}d overdue</span>}
                      </td>
                      <td className="text-sm text-gray-500">
                        {b.returnDate ? new Date(b.returnDate).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className={b.fine > 0 ? 'text-red-600 font-semibold text-sm' : 'text-gray-400 text-sm'}>
                        {b.fine > 0 ? `₹${b.fine.toFixed(2)}` : '—'}
                      </td>
                      <td>
                        {b.status !== 'RETURNED' && (
                          <button
                            onClick={() => setReturnTarget(b)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          >
                            <RotateCcw size={13} /> Return
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={8} className="text-center text-gray-400 py-12">No borrow records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={showIssue} onClose={() => setShowIssue(false)} title="Issue Book to Member" size="md">
        <IssueForm onSubmit={handleIssue} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={!!returnTarget} onClose={() => setReturnTarget(null)} onConfirm={handleReturn}
        title="Return Book"
        message={`Return "${returnTarget?.bookTitle}" from ${returnTarget?.userName}? ${returnTarget?.overdueDays > 0 ? `Fine: ₹${(returnTarget.overdueDays * 5).toFixed(2)}` : 'No fine applicable.'}`}
        confirmLabel="Confirm Return"
      />
    </div>
  )
}
