// FILE: src/components/ui/StatCard.jsx
export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100  text-blue-700'  },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-700' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-100   text-red-700'   },
    yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-700' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`card ${c.bg} border-0`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}
