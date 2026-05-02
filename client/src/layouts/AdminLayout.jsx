import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, Database, Plus } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-arena-page text-arena-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-arena-line bg-arena-panel p-4 lg:block">
        <Link to="/problems" className="mb-8 flex items-center gap-2 text-sm text-arena-muted hover:text-arena-text">
          <ArrowLeft size={16} /> Back to app
        </Link>
        <div className="mb-6 flex items-center gap-2 font-semibold">
          <Database size={20} className="text-arena-orange" />
          Admin Console
        </div>
        <nav className="grid gap-1">
          <NavLink className="nav-link" end to="/admin">Problems</NavLink>
          <NavLink className="nav-link" to="/admin/problems/new">
            <Plus size={16} /> New problem
          </NavLink>
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
