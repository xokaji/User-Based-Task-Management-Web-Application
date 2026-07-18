import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ME";

  useEffect(() => {
    if (!isLoggingOut) return undefined;

    const timer = setTimeout(() => {
      dispatch(logout());
      setIsLoggingOut(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, isLoggingOut]);

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 backdrop-blur-md">
          <div className="rounded-[1.75rem] border border-white/60 bg-white/90 px-6 py-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Signing you out</p>
                <p className="text-sm text-slate-500">Please wait a moment...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
              TF
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">TaskFlow Pro</h1>
              <p className="text-xs text-slate-500">Enterprise productivity workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Workspace active</span>
            </div>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
              aria-label={user?.name || "User profile"}
            >
              {initials}
            </button>
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Signed in as</span>
              <span className="text-sm font-medium text-slate-800">{user?.name || "Team member"}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="soft-button-ghost disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
