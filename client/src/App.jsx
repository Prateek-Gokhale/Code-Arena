import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Problems from "./pages/Problems.jsx";
import ProblemWorkspace from "./pages/ProblemWorkspace.jsx";
import Submissions from "./pages/Submissions.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminProblems from "./pages/admin/AdminProblems.jsx";
import ProblemForm from "./pages/admin/ProblemForm.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loader">Loading CodeArena...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loader">Loading CodeArena...</div>;
  return user?.role === "admin" ? children : <Navigate to="/problems" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:slug" element={<ProblemWorkspace />} />
        <Route
          path="/submissions"
          element={
            <RequireAuth>
              <Submissions />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminProblems />} />
        <Route path="problems/new" element={<ProblemForm />} />
        <Route path="problems/:id/edit" element={<ProblemForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
