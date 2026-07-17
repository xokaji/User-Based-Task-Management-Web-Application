import { useDispatch } from "react-redux";
import { deleteTask, toggleTaskStatus } from "../store/slices/taskSlice.js";

const priorityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

function TaskItem({ task, onEdit }) {
  const dispatch = useDispatch();

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
    <div className="bg-white rounded-lg shadow-sm border p-4 flex justify-between items-start gap-3">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={handleToggle}
          className="mt-1.5 h-4 w-4"
        />
        <div className="flex-1">
          <h4
            className={`font-medium ${
              task.status === "completed" ? "line-through text-slate-400" : "text-slate-800"
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-slate-500 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs text-slate-400">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="text-xs px-2 py-1 rounded-md border hover:bg-slate-50 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-xs px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
