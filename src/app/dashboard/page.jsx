"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import FormTasks from "./components/form-task";
import { toast } from "react-hot-toast";
import TaskColumns from "./components/task-columns";
import { useCurrentUser } from "@/hooks/use-current-user";
import api from "../../services/axios";
import { FiPlus } from "react-icons/fi"; // Ícono de suma

// Aquí en tu componente DashoardPage:
const DashboardPage = () => {
  const { userId, session } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // States map with titles
  const stateTitles = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",
  };

  // Close form modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Open form modal
  const handleModalOpen = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Get tasks when session is up
  useEffect(() => {
    if (session) getTasks();
  }, [session]);

  // GET all tasks
  const getTasks = async () => {
    try {
      const data = await api.get("/tasks");

      const groupedTasks = data.reduce((acc, task) => {
        acc[task.state] = acc[task.state] || [];
        acc[task.state].push(task);
        return acc;
      }, {});

      setTasks({
        todo: groupedTasks.todo || [],
        inProgress: groupedTasks.inProgress || [],
        done: groupedTasks.done || [],
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }
  };

  // POST and PUT function to handle submit form (add & update tasks)
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const url = selectedTask ? `/tasks/${selectedTask._id}` : "/tasks";
      const ownerId = session.user.id;
      const taskDataWithOwner = { ...values, owner: ownerId };

      const method = selectedTask ? "put" : "post";

      const res = await api[method](url, taskDataWithOwner);

      let newTask;
      if (method === "post") {
        newTask = { ...taskDataWithOwner, _id: res._id };
        toast.success("Task created successfully");
      } else {
        newTask = res.task;
        toast.success("Task updated successfully");
      }

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };

        if (!selectedTask) {
          updatedTasks[newTask.state] = [
            ...updatedTasks[newTask.state],
            newTask,
          ];
        } else {
          updatedTasks[newTask.state] = updatedTasks[newTask.state].map(
            (task) =>
              task._id === newTask._id ? { ...task, ...newTask } : task
          );
        }

        return updatedTasks;
      });
      getTasks();
      handleModalClose();
    } catch (error) {
      toast.error("Error submitting task");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE tasks
  const deleteTasks = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[task.state] = updatedTasks[task.state].filter(
          (t) => t._id !== task._id
        );
        return updatedTasks;
      });

      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl md:text-4xl text-left text-neutral-900 font-bold">
          My Board
        </h1>
        <Button
          className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-2 rounded flex items-center gap-2"
          onClick={() => handleModalOpen()}
        >
          <FiPlus />
        </Button>
      </div>

      <FormTasks
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        task={selectedTask}
      />

      <div className="container mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["todo", "inProgress", "done"].map((state) => (
          <div key={state}>
            <TaskColumns
              title={stateTitles[state]}
              tasks={tasks[state]}
              onEdit={handleModalOpen}
              onDelete={deleteTasks}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
