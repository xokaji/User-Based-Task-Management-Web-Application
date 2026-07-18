import { useDispatch } from "react-redux";
import { deleteTask, toggleTaskStatus } from "../store/slices/taskSlice.js";

const priorityColors = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  medium: "bg-amber-50 text-amber-700 ring-amber-100",
  high: "bg-rose-50 text-rose-700 ring-rose-100",
};

function TaskItem({ task, onEdit }) {
  const dispatch = useDispatch();
  const initials =
    task.title
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "T";

  const isCompleted = task.status === "completed";
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && !isCompleted && dueDate < new Date();
  const completionWidth = isCompleted ? 100 : task.priority === "high" ? 42 : task.priority === "medium" ? 28 : 18;

  const handleToggle = () => {
    dispatch(
      toggleTaskStatus({
        id: task._id,
        status: task.status === "pending" ? "completed" : "pending",
      })
    );
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      dispatch(deleteTask(task._id));
    }
  };

  return (
    <div className="task-row overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={handleToggle}
            className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition duration-200 ${
              isCompleted
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
            aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          >
            <span
              className={`h-4 w-4 rounded-full border-2 ${
                isCompleted ? "border-emerald-600 bg-emerald-600" : "border-current"
              }`}
            />
          </button>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs font-semibold text-white shadow-sm">
                {initials}
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityColors[task.priority]}`}>
                {task.priority} priority
              </span>
              {isCompleted ? (
                <span className="soft-chip border-emerald-100 bg-emerald-50 text-emerald-700">
                  Completed
                </span>
              ) : (
                <span className="soft-chip">
                  {isOverdue ? "Overdue" : "Active"}
                </span>
              )}
            </div>

            <div>
              <h4
                className={`text-lg font-semibold tracking-tight ${
                  isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900"
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {task.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Completion</span>
                <span>{completionWidth}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500"
                  }`}
                  style={{ width: `${completionWidth}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {task.dueDate && (
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${isOverdue ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  Due {dueDate.toLocaleDateString()}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {isCompleted ? "Archived flow" : "Live task"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
          <button onClick={() => onEdit(task)} className="soft-button-ghost min-w-[88px]">
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="soft-button min-w-[88px] border border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100 focus:ring-rose-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
