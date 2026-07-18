import TaskItem from "./TaskItem.jsx";

function TaskSkeleton() {
  return (
    <div className="task-row overflow-hidden">
      <div className="animate-pulse-soft p-5">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-slate-100" />
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <div className="h-7 w-24 rounded-full bg-slate-100" />
              <div className="h-7 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="h-5 w-3/5 rounded-full bg-slate-100" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskList({ tasks, loading, onEdit }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <TaskSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-xl font-semibold text-white shadow-lg shadow-indigo-500/20">
          +
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">No tasks found</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Try a different filter, clear search terms, or create a new task to get the workspace moving.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default TaskList;
