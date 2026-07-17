import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import { fetchTasks, setFilters } from "../store/slices/taskSlice.js";

function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, pagination, filters, status } = useSelector((state) => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(fetchTasks({ ...filters, page: pagination.page, limit: pagination.limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleStatusFilter = (status) => {
    dispatch(setFilters({ status }));
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split(":");
    dispatch(setFilters({ sortBy, order }));
  };

  const goToPage = (page) => {
    dispatch(fetchTasks({ ...filters, page, limit: pagination.limit }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <TaskForm
          editingTask={editingTask}
          onDone={() => setEditingTask(null)}
        />

        <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-[160px]"
          />
          <div className="flex gap-1">
            {["all", "pending", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-md border transition capitalize ${
                  filters.status === s
                    ? "bg-slate-800 text-white border-slate-800"
                    : "hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            onChange={handleSortChange}
            defaultValue="createdAt:desc"
            className="border rounded-md px-2 py-1.5 text-xs"
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="createdAt:asc">Oldest first</option>
            <option value="dueDate:asc">Due date</option>
            <option value="priority:desc">Priority</option>
          </select>
        </div>

        <TaskList tasks={tasks} loading={status === "loading"} onEdit={setEditingTask} />

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`text-xs h-7 w-7 rounded-md border transition ${
                  pagination.page === p
                    ? "bg-slate-800 text-white border-slate-800"
                    : "hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
