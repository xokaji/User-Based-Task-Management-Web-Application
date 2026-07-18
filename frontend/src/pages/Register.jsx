import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice.js";
import logo from "../assets/logo.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]" />
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute right-16 top-1/3 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-12 left-1/4 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-16 h-24 w-24 rounded-full bg-indigo-400/10 blur-2xl" />
      <div className="absolute right-10 bottom-16 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <form onSubmit={handleSubmit} className="surface-card w-full max-w-md overflow-hidden">
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-0">
            <img
              src={logo}
              alt="TaskFlow logo"
              className="block h-40 w-full object-cover object-center"
            />
          </div>

          <div className="px-6 pt-1 text-center">
            <h6 className="text-xl font-semibold tracking-tight text-slate-900">
              Create an account
            </h6>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set up your workspace in a clean, focused environment.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="space-y-2">
              <label className="section-label" htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="soft-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="section-label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="soft-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="section-label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="soft-input"
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={status === "loading"} className="soft-button-primary w-full">
              {status === "loading" ? "Creating account..." : "Register"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
