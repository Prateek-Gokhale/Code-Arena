import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await login(form);
      navigate("/problems");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-arena-muted">Continue your CodeArena practice.</p>
        <label className="form-label">Email<input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label className="form-label">Password<input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button h-11 w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="text-center text-sm text-arena-muted">New here? <Link className="text-arena-orange" to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
