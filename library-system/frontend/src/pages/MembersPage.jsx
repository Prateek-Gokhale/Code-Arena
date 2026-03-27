// FILE: src/pages/MembersPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { membersApi } from '../api/membersApi'
import { useAuth } from '../features/auth/AuthContext'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import SearchInput from '../components/ui/SearchInput'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Edit2, UserCheck, UserX, Mail, Phone } from 'lucide-react'

function MemberForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: defaultValues || { email:'', password:'', name:'', role:'MEMBER', phone:'', address:'' }
  })
  useEffect(() => { reset(defaultValues || { email:'', password:'', name:'', role:'MEMBER', phone:'', address:'' }) }, [defaultValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Full Name *</label>
          <input className={`input ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: 'Required' })} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Email *</label>
          <input type="email" className={`input ${errors.email ? 'border-red-400' : ''}`} {...register('email', { required: 'Required' })} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">{defaultValues ? 'New Password' : 'Password *'}</label>
          <input type="password" className={`input ${errors.password ? 'border-red-400' : ''}`}
            {...register('password', { required: !defaultValues ? 'Required' : false, minLength: { value: 6, message: 'Min 6 chars' } })} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label">Role *</label>
          <select className="input" {...register('role', { required: true })}>
            <option value="MEMBER">Member</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" {...register('phone')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <textarea className="input resize-none h-16" {...register('address')} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : defaultValues ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  )
}

export default function MembersPage() {
  const { isAdmin } = useAuth()
  const [members, setMembers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)

  const fetchMembers = useCallback(() => {
    setLoading(true)
    membersApi.getAll({ page, size: 10, search: search || undefined })
      .then(res => {
        const data = res.data.data
        setMembers(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => toast.error('Failed to fetch members'))
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetchMembers() }, [fetchMembers])
  useEffect(() => { setPage(0) }, [search])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (editMember) {
        await membersApi.update(editMember.id, data)
        toast.success('Member updated')
      } else {
        await membersApi.create(data)
        toast.success('Member added')
      }
      setShowForm(false); setEditMember(null); fetchMembers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleToggle = async () => {
    try {
      await membersApi.toggleStatus(toggleTarget.id)
      toast.success(`Member ${toggleTarget.active ? 'suspended' : 'activated'}`)
      fetchMembers()
    } catch { toast.error('Failed to update status') }
  }

  const roleBadge = (role) => {
    const map = { ADMIN: 'badge-red', LIBRARIAN: 'badge-blue', MEMBER: 'badge-green' }
    return <span className={`badge ${map[role] || 'badge-gray'}`}>{role}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Members</h2>
          <p className="text-gray-500 text-sm mt-1">Manage library members and staff</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { setEditMember(null); setShowForm(true) }}>
            <Plus size={16} /> Add Member
          </button>
        )}
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or email…" />
        <span className="text-sm text-gray-500">{members.length} members shown</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.length ? members.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm shrink-0">
                            {m.name?.[0]}
                          </div>
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                          <Mail size={13} /> {m.email}
                        </a>
                      </td>
                      <td className="text-gray-500 text-sm">
                        {m.phone ? <span className="flex items-center gap-1"><Phone size={13} />{m.phone}</span> : '—'}
                      </td>
                      <td>{roleBadge(m.role)}</td>
                      <td>
                        <span className={`badge ${m.active ? 'badge-green' : 'badge-red'}`}>
                          {m.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="text-gray-500 text-sm">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditMember(m); setShowForm(true) }} className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => setToggleTarget(m)} className={`p-1.5 rounded-lg transition-colors ${m.active ? 'text-gray-400 hover:bg-red-50 hover:text-red-600' : 'text-gray-400 hover:bg-green-50 hover:text-green-600'}`} title={m.active ? 'Suspend' : 'Activate'}>
                              {m.active ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )) : (
                    <tr><td colSpan={isAdmin ? 7 : 6} className="text-center text-gray-400 py-12">No members found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditMember(null) }} title={editMember ? 'Edit Member' : 'Add New Member'} size="lg">
        <MemberForm onSubmit={handleSubmit} defaultValues={editMember} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={!!toggleTarget} onClose={() => setToggleTarget(null)} onConfirm={handleToggle}
        title={toggleTarget?.active ? 'Suspend Member' : 'Activate Member'}
        message={`Are you sure you want to ${toggleTarget?.active ? 'suspend' : 'activate'} ${toggleTarget?.name}?`}
        confirmLabel={toggleTarget?.active ? 'Suspend' : 'Activate'}
        danger={toggleTarget?.active}
      />
    </div>
  )
}
