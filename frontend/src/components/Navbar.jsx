import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800">Task Manager</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">Hi, {user?.name}</span>
        <button
          onClick={() => dispatch(logout())}
          className="text-sm px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
