// components/TaskColumn.js
const TaskColumns = ({ title, tasks }) => {
  return (
    <div className="bg-slate-100 p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-medium text-neutral-700">{title}</h3>
      <div className="mt-3 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-black">No tasks to show</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-xl shadow-sm p-2">
              <h4 className="font-semibold text-black">{task.title}</h4>
              <p className="text-black">{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumns;
