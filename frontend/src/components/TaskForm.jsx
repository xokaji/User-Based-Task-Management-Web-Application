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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
      <h3 className="font-semibold text-slate-800">
        {editingTask ? "Edit Task" : "New Task"}
      </h3>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={2}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <div className="grid grid-cols-3 gap-2">
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded-md px-2 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded-md px-2 py-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="border rounded-md px-2 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-slate-800 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-700 transition"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm px-4 py-2 rounded-md border hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
