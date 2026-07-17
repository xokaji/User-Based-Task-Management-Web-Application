import TaskItem from "./TaskItem.jsx";

function TaskList({ tasks, loading, onEdit }) {
  if (loading) {
    return <p className="text-sm text-slate-400 text-center py-8">Loading tasks...</p>;
  }

  if (!tasks.length) {
    return <p className="text-sm text-slate-400 text-center py-8">No tasks found.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default TaskList;
