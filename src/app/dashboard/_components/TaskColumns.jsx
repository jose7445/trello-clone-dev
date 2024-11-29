import React, { useState } from "react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import AddTaskForm from "./AddTaskForm"; // Asegúrate de que el componente AddTaskModal esté correctamente importado.

const TaskColumns = ({ title, tasks, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-100 p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-medium text-neutral-700">{title}</h3>
      <div className="mt-3 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-black">No tasks to show</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-sm p-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-black">{task.title}</h4>
              </div>
              <MenuRoot>
                <MenuTrigger asChild>
                  <button className="bg-transparent border border-gray-300 text-sm text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200">
                    Options
                  </button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="edit-task" onClick={() => onEdit(task)}>
                    Edit Task
                  </MenuItem>
                  <MenuItem value="delete-task" onClick={() => onDelete(task)}>
                    Delete Task
                  </MenuItem>
                  <MenuItem value="mark-complete">Mark as Complete</MenuItem>
                </MenuContent>
              </MenuRoot>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumns;
