import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice.js";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Create Account</h2>
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-slate-800 text-white text-sm py-2 rounded-md hover:bg-slate-700 transition disabled:opacity-50"
        >
          {status === "loading" ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-slate-800 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
