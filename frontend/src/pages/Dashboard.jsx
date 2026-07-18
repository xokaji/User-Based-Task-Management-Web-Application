import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  deleteTask,
  fetchTasks,
  setFilters,
  toggleTaskStatus,
  updateTask,
} from "../store/slices/taskSlice.js";
import { logout } from "../store/slices/authSlice.js";
import logo2 from "../assets/logo2.png";

const sidebarItems = ["Dashboard", "My Tasks", "Projects", "Calendar", "Teams", "Inbox", "Settings"];

const emptyTask = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 12h6V4H4v8zm10 8h6V8h-6v12zM4 20h6v-6H4v6zm10-10h6V4h-6v6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35m1.6-5.15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M8 3v3m8-3v3M4.5 9h15M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M3.5 7.5A2.5 2.5 0 016 5h4l2 2h6a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0118 19H6a2.5 2.5 0 01-2.5-2.5v-9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 10-3-3L5 17v3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 7h16M9 7l1-2h4l1 2m-8 0l1 11h6l1-11M10 11v6m4-6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 12h4l2-5 4 10 2-5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatActivityDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function priorityClass(priority) {
  if (priority === "high") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function statusClass(status) {
  return status === "completed"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-100 text-slate-600";
}

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, pagination, filters, status } = useSelector((state) => state.tasks);

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [editingTask, setEditingTask] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composer, setComposer] = useState(emptyTask);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchTasks({ ...filters, page: pagination.page, limit: pagination.limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchInput]);

  useEffect(() => {
    if (!isLoggingOut) return undefined;

    const timer = setTimeout(() => {
      dispatch(logout());
      setIsLoggingOut(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, isLoggingOut]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = useMemo(() => new Date(), []);
  const startOfToday = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );
  const nextWeek = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    [today]
  );

  const derived = useMemo(() => {
    const sortedByDueDate = [...tasks].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      return dateA - dateB;
    });

    const todayTasks = sortedByDueDate.filter((task) => {
      if (task.status === "completed") return false;
      if (!task.dueDate) return true;
      const dueDate = new Date(task.dueDate);
      return dueDate <= startOfToday || sameDay(dueDate, today);
    });

    const upcomingDeadlines = sortedByDueDate
      .filter((task) => task.status !== "completed" && task.dueDate)
      .filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate > startOfToday && dueDate <= nextWeek;
      })
      .slice(0, 6);

    const projectMap = new Map();
    tasks.forEach((task) => {
      const name =
        task.description?.split(/\r?\n/)[0]?.trim() ||
        task.title?.split(" ").slice(0, 3).join(" ").trim() ||
        "General Work";
      const key = name.length > 36 ? `${name.slice(0, 36).trim()}...` : name;
      const current = projectMap.get(key) || { name: key, total: 0, completed: 0 };
      current.total += 1;
      if (task.status === "completed") current.completed += 1;
      projectMap.set(key, current);
    });

    const projects = [...projectMap.values()]
      .map((project) => ({
        ...project,
        remaining: project.total - project.completed,
        progress: project.total ? Math.round((project.completed / project.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const recentActivity = [...tasks]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map((task) => {
        const updatedAt = new Date(task.updatedAt || task.createdAt);
        const createdAt = new Date(task.createdAt || task.updatedAt);
        const isUpdated = updatedAt.getTime() - createdAt.getTime() > 1000 * 60 * 2;

        return {
          ...task,
          label: task.status === "completed" ? "Completed" : isUpdated ? "Updated" : "Added",
          meta: task.description?.split(/\r?\n/)[0]?.trim() || "Task changed",
          time: formatActivityDate(updatedAt),
        };
      });

    return {
      todayTasks,
      upcomingDeadlines,
      projects,
      recentActivity,
      totalTasks: tasks.length,
      inProgress: tasks.filter((task) => task.status === "pending").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    };
  }, [nextWeek, startOfToday, tasks, today]);

  useEffect(() => {
    if (!composerOpen) return;

    if (editingTask) {
      setComposer({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
      return;
    }

    setComposer(emptyTask);
  }, [composerOpen, editingTask]);

  const submitTask = async (e) => {
    e.preventDefault();
    if (!composer.title.trim()) return;

    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, updates: composer }));
    } else {
      await dispatch(createTask(composer));
    }

    setComposerOpen(false);
    setEditingTask(null);
    setComposer(emptyTask);
  };

  const openNewTask = () => {
    setEditingTask(null);
    setComposer(emptyTask);
    setComposerOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setComposerOpen(true);
  };

  const handleToggleTask = (task) => {
    dispatch(
      toggleTaskStatus({
        id: task._id,
        status: task.status === "pending" ? "completed" : "pending",
      })
    );
  };

  const handleDeleteTask = (task) => {
    if (window.confirm("Delete this task?")) {
      dispatch(deleteTask(task._id));
    }
  };

  const startLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
  };

  const workspaceName = user?.name || "Team member";
  const initials =
    workspaceName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "TM";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-md">
          <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
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

      {composerOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)]">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {editingTask ? "Edit task" : "New task"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {editingTask ? "Update task details" : "Create a new task"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(false);
                    setEditingTask(null);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={submitTask} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Title
                  </label>
                  <input
                    value={composer.title}
                    onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="Task title"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Description
                  </label>
                  <textarea
                    value={composer.description}
                    onChange={(e) => setComposer({ ...composer, description: e.target.value })}
                    className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                    placeholder="Optional notes or project name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </label>
                  <select
                    value={composer.status}
                    onChange={(e) => setComposer({ ...composer, status: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Priority
                  </label>
                  <select
                    value={composer.priority}
                    onChange={(e) => setComposer({ ...composer, priority: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={composer.dueDate}
                    onChange={(e) => setComposer({ ...composer, dueDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(false);
                    setEditingTask(null);
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  {editingTask ? "Update task" : "Add task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <img src={logo2} alt="TaskFlow logo" className="h-11 w-11 rounded-2xl object-contain" />
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900">TaskFlow Pro</div>
            <div className="text-xs text-slate-500">Workspace</div>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-5">
          {sidebarItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition duration-200 ${
                index === 0
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-xl ${index === 0 ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                <DashboardIcon />
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Signed in as
            </div>
            <div className="mt-2 text-sm font-medium text-slate-900">{workspaceName}</div>
            <div className="mt-1 text-xs text-slate-500">{user?.email || "Workspace owner"}</div>
            <button
              type="button"
              onClick={startLogout}
              disabled={isLoggingOut}
              className="mt-4 flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              <span className="text-slate-300">•</span>
              <span>{currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
            </div>

            <div className="hidden flex-1 items-center lg:flex">
              <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <SearchIcon />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search tasks or projects..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {initials}
              </span>
              <span className="hidden text-sm font-medium text-slate-800 sm:block">{workspaceName}</span>
            </div>

            <button
              type="button"
              onClick={openNewTask}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <PlusIcon />
              New Task
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Total Tasks", value: derived.totalTasks },
              { label: "In Progress", value: derived.inProgress },
              { label: "Completed", value: derived.completed },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {item.label}
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {item.value}
                </div>
              </div>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">Today's Tasks</h2>
                    <p className="mt-1 text-sm text-slate-500">What needs your attention now.</p>
                  </div>
                  <div className="text-sm text-slate-500">{derived.todayTasks.length} items</div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {status === "loading" ? (
                  <div className="space-y-3 p-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                  </div>
                ) : derived.todayTasks.length ? (
                  derived.todayTasks.map((task) => {
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const isCompleted = task.status === "completed";
                    const isOverdue = dueDate && !isCompleted && dueDate < startOfToday;
                    const isDueToday = dueDate && sameDay(dueDate, today);

                    return (
                      <div
                        key={task._id}
                        className="group flex items-start gap-4 px-5 py-4 transition duration-200 hover:bg-slate-50"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task)}
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-300 bg-white text-transparent group-hover:border-indigo-500"
                          }`}
                          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
                        >
                          <CheckIcon />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => openEditTask(task)}
                                className={`truncate text-left text-sm font-semibold tracking-tight transition hover:text-indigo-600 ${
                                  isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                                }`}
                              >
                                {task.title}
                              </button>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(task.status)}`}>
                                  {task.status}
                                </span>
                                <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${priorityClass(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                    isOverdue
                                      ? "border-rose-200 bg-rose-50 text-rose-700"
                                      : isDueToday
                                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                  }`}
                                >
                                  <CalendarIcon />
                                  {dueDate ? formatDate(dueDate) : "No due date"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => openEditTask(task)}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                              >
                                <EditIcon />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(task)}
                                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                              >
                                <TrashIcon />
                                Delete
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <CheckIcon />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">Nothing due today</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Add a task or change filters to see work that needs attention.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                      Upcoming Deadlines
                    </h2>
                    <span className="text-sm text-slate-500">Next 7 days</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-200">
                  {derived.upcomingDeadlines.length ? (
                    derived.upcomingDeadlines.map((task) => {
                      const dueDate = new Date(task.dueDate);
                      return (
                        <button
                          key={task._id}
                          type="button"
                          onClick={() => openEditTask(task)}
                          className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${task.priority === "high" ? "bg-rose-500" : task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-slate-900">{task.title}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {formatDate(dueDate)} - {task.priority}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-10 text-sm text-slate-500">No upcoming deadlines.</div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">My Projects</h2>
                </div>

                <div className="space-y-4 px-5 py-5">
                  {derived.projects.length ? (
                    derived.projects.map((project) => (
                      <div key={project.name} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-900">{project.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{project.remaining} remaining</div>
                          </div>
                          <div className="text-xs font-medium text-slate-500">{project.progress}%</div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-200"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No project data yet.</div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent Activity</h2>
            </div>

            <div className="divide-y divide-slate-200">
              {derived.recentActivity.length ? (
                derived.recentActivity.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 px-5 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <ActivityIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900">
                        {item.label} - {item.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.meta} - {item.time}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-sm text-slate-500">Recent changes will appear here.</div>
              )}
            </div>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="text-sm text-slate-500">
              Showing {tasks.length} tasks on page {pagination.page} of {pagination.totalPages}
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      dispatch(
                        fetchTasks({
                          ...filters,
                          page,
                          limit: pagination.limit,
                        })
                      )
                    }
                    className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      pagination.page === page
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
