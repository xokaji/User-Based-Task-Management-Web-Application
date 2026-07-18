import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../store/slices/taskSlice.js";

const emptyTask = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

function TaskForm({ editingTask, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(emptyTask);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, updates: form }));
    } else {
      await dispatch(createTask(form));
    }
    setForm(emptyTask);
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card overflow-hidden">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="section-label">Task composer</div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {editingTask ? "Refine task details" : "Create a new task"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep priorities, timelines, and status aligned in one polished workspace.
            </p>
          </div>
          <div className="soft-chip self-start">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>{editingTask ? "Editing mode" : "Draft mode"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <label className="section-label" htmlFor="task-title">
            Title
          </label>
          <input
            id="task-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to get done?"
            className="soft-input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="section-label" htmlFor="task-description">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add context, dependencies, or acceptance criteria"
            rows={4}
            className="soft-input min-h-[120px] resize-y"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="section-label" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="soft-select"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="section-label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="soft-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="section-label" htmlFor="task-due-date">
              Due date
            </label>
            <input
              id="task-due-date"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="soft-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button type="submit" className="soft-button-primary">
            {editingTask ? "Update task" : "Add task"}
          </button>
          {editingTask && (
            <button type="button" onClick={onDone} className="soft-button-ghost">
              Cancel editing
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
