"use client";

import React from "react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import AddTaskForm from "./form-task";
import { IconButton, Separator } from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";

const TaskColumns = ({ title, tasks, onEdit, onDelete }) => {
  const columnColors = {
    "To Do": "bg-red-100",
    "In Progress": "bg-blue-100",
    Done: "bg-green-100",
  };

  return (
    <div
      className={`p-4 border border-gray-300 rounded-lg ${columnColors[title]}`}
    >
      <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
      <Separator variant="solid" className="border border-gray-500 mt-2" />

      <div className="mt-3 space-y-2">
        {tasks.length === 0 ? (
          <div className="text-neutral-700 font-semibold">No tasks to show</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-sm p-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-neutral-700">{task.title}</h4>
              </div>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label="Search database">
                    <HiDotsVertical className="text-primary" />
                  </IconButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="edit-task" onClick={() => onEdit(task)}>
                    Edit Task
                  </MenuItem>
                  <MenuItem value="delete-task" onClick={() => onDelete(task)}>
                    Delete Task
                  </MenuItem>
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
