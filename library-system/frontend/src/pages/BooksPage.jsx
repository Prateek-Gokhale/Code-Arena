// FILE: src/pages/BooksPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { booksApi } from '../api/booksApi'
import { useAuth } from '../features/auth/AuthContext'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import SearchInput from '../components/ui/SearchInput'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, BookOpen, Eye } from 'lucide-react'

const INITIAL_BOOK = { title:'', author:'', isbn:'', publisher:'', publishedYear:'', description:'', coverImageUrl:'', totalCopies:1 }

function BookForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: defaultValues || INITIAL_BOOK })
  useEffect(() => { reset(defaultValues || INITIAL_BOOK) }, [defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Title *</label>
          <input className={`input ${errors.title ? 'border-red-400' : ''}`} {...register('title', { required: 'Required' })} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="label">Author *</label>
          <input className={`input ${errors.author ? 'border-red-400' : ''}`} {...register('author', { required: 'Required' })} />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
        </div>
        <div>
          <label className="label">ISBN *</label>
          <input className={`input ${errors.isbn ? 'border-red-400' : ''}`} {...register('isbn', { required: 'Required' })} />
          {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn.message}</p>}
        </div>
        <div>
          <label className="label">Publisher</label>
          <input className="input" {...register('publisher')} />
        </div>
        <div>
          <label className="label">Published Year</label>
          <input type="number" className="input" min={1000} max={2100} {...register('publishedYear', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Total Copies *</label>
          <input type="number" min={1} className={`input ${errors.totalCopies ? 'border-red-400' : ''}`}
            {...register('totalCopies', { required: 'Required', min: 1, valueAsNumber: true })} />
          {errors.totalCopies && <p className="text-red-500 text-xs mt-1">{errors.totalCopies.message}</p>}
        </div>
        <div>
          <label className="label">Cover Image URL</label>
          <input className="input" placeholder="https://..." {...register('coverImageUrl')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input resize-none h-20" {...register('description')} />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : defaultValues ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  )
}

function BookDetailModal({ book, open, onClose }) {
  if (!book) return null
  return (
    <Modal open={open} onClose={onClose} title="Book Details" size="lg">
      <div className="flex gap-6">
        {book.coverImageUrl
          ? <img src={book.coverImageUrl} alt={book.title} className="w-32 h-44 object-cover rounded-lg border border-gray-200 shrink-0" onError={e => { e.target.style.display='none' }} />
          : <div className="w-32 h-44 bg-blue-50 rounded-lg flex items-center justify-center shrink-0"><BookOpen size={40} className="text-blue-300" /></div>
        }
        <div className="flex-1 space-y-3">
          <div><h3 className="text-xl font-bold text-gray-900">{book.title}</h3><p className="text-gray-500">by {book.author}</p></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">ISBN:</span> <span className="font-medium">{book.isbn}</span></div>
            <div><span className="text-gray-500">Publisher:</span> <span className="font-medium">{book.publisher || '—'}</span></div>
            <div><span className="text-gray-500">Year:</span> <span className="font-medium">{book.publishedYear || '—'}</span></div>
            <div><span className="text-gray-500">Total Copies:</span> <span className="font-medium">{book.totalCopies}</span></div>
            <div><span className="text-gray-500">Available:</span>
              <span className={`font-semibold ml-1 ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.availableCopies}</span>
            </div>
            <div><span className="text-gray-500">Status:</span>
              <span className={`badge ml-1 ${book.available ? 'badge-green' : 'badge-red'}`}>{book.available ? 'Available' : 'Unavailable'}</span>
            </div>
          </div>
          {book.categories?.size > 0 && (
            <div className="flex flex-wrap gap-1">
              {[...book.categories].map(c => <span key={c} className="badge-blue badge">{c}</span>)}
            </div>
          )}
          {book.description && <p className="text-sm text-gray-600 leading-relaxed border-t pt-3">{book.description}</p>}
        </div>
      </div>
    </Modal>
  )
}

export default function BooksPage() {
  const { isAdmin } = useAuth()
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editBook, setEditBook] = useState(null)
  const [viewBook, setViewBook] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetchBooks = useCallback(() => {
    setLoading(true)
    booksApi.getAll({ page, size: 10, search: search || undefined })
      .then(res => {
        const data = res.data.data
        setBooks(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => toast.error('Failed to fetch books'))
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetchBooks() }, [fetchBooks])
  useEffect(() => { setPage(0) }, [search])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (editBook) {
        await booksApi.update(editBook.id, data)
        toast.success('Book updated')
      } else {
        await booksApi.create(data)
        toast.success('Book added')
      }
      setShowForm(false)
      setEditBook(null)
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await booksApi.delete(deleteId)
      toast.success('Book deleted')
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete book')
    }
  }

  const openEdit = (book) => {
    setEditBook(book)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Books</h2>
          <p className="text-gray-500 text-sm mt-1">Manage the library catalog</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { setEditBook(null); setShowForm(true) }}>
            <Plus size={16} /> Add Book
          </button>
        )}
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search title, author, ISBN…" />
        <span className="text-sm text-gray-500">{books.length} books shown</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Copies</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length ? books.map(book => (
                    <tr key={book.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {book.coverImageUrl
                            ? <img src={book.coverImageUrl} alt="" className="w-8 h-10 object-cover rounded border border-gray-200 shrink-0" onError={e => { e.target.style.display='none' }} />
                            : <div className="w-8 h-10 bg-blue-50 rounded flex items-center justify-center shrink-0"><BookOpen size={14} className="text-blue-400" /></div>
                          }
                          <span className="font-medium text-gray-900 max-w-[160px] truncate block">{book.title}</span>
                        </div>
                      </td>
                      <td className="text-gray-600">{book.author}</td>
                      <td className="font-mono text-xs text-gray-500">{book.isbn}</td>
                      <td className="text-center">{book.totalCopies}</td>
                      <td className="text-center font-semibold">
                        <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}>{book.availableCopies}</span>
                      </td>
                      <td>
                        <span className={`badge ${book.available ? 'badge-green' : 'badge-red'}`}>
                          {book.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewBook(book)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View"><Eye size={16} /></button>
                          {isAdmin && <>
                            <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => setDeleteId(book.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="text-center text-gray-400 py-12">No books found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditBook(null) }} title={editBook ? 'Edit Book' : 'Add New Book'} size="lg">
        <BookForm onSubmit={handleSubmit} defaultValues={editBook} loading={saving} />
      </Modal>

      <BookDetailModal book={viewBook} open={!!viewBook} onClose={() => setViewBook(null)} />

      <ConfirmDialog
        open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Book" message="Are you sure you want to delete this book? This cannot be undone."
        confirmLabel="Delete" danger
      />
    </div>
  )
}
