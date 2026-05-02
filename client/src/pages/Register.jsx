import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await register(form);
      navigate("/problems");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-arena-muted">Save submissions, track progress, and unlock the dashboard.</p>
        <label className="form-label">Name<input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label className="form-label">Email<input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label className="form-label">Password<input className="input" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button h-11 w-full" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
        <p className="text-center text-sm text-arena-muted">Already registered? <Link className="text-arena-orange" to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}
