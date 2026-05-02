import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Code2, Moon, Sun, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-arena-page text-arena-text">
      <header className="sticky top-0 z-40 border-b border-arena-line bg-arena-panel/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-5 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded bg-arena-orange text-zinc-950">
              <Code2 size={18} />
            </span>
            <span>CodeArena</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-arena-muted md:flex">
            <NavLink className="nav-link" to="/problems">Problems</NavLink>
            <NavLink className="nav-link" to="/submissions">Submissions</NavLink>
            <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            {user?.role === "admin" && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                <button className="hidden items-center gap-2 rounded px-3 py-2 text-sm text-arena-muted hover:bg-zinc-500/10 sm:flex" onClick={() => navigate("/dashboard")}>
                  <UserCircle size={18} />
                  {user.name}
                </button>
                <button className="secondary-button" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="secondary-button" to="/login">Sign in</Link>
                <Link className="primary-button" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
