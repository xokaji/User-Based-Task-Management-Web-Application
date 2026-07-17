import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Login</h2>
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
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-slate-800 text-white text-sm py-2 rounded-md hover:bg-slate-700 transition disabled:opacity-50"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-slate-500">
          Don't have an account? <Link to="/register" className="text-slate-800 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
