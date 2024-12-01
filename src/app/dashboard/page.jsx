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

  const stateTitles = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalOpen = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getTasks = async () => {
    try {
      const data = await api.get("/tasks");

      const todoTasks = data.filter((task) => task.state === "todo") || [];
      const inProgressTasks =
        data.filter((task) => task.state === "inProgress") || [];
      const doneTasks = data.filter((task) => task.state === "done") || [];

      setTasks({
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }
  };

  useEffect(() => {
    if (session) getTasks();
  }, [session]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = selectedTask ? `/tasks/${selectedTask._id}` : "/tasks";

      const ownerId = session.user.id;
      const taskDataWithOwner = { ...values, owner: ownerId };

      const method = selectedTask ? "put" : "post";

      const res = await api[method](url, taskDataWithOwner);

      toast.success(selectedTask ? "Task updated" : "Task added");

      getTasks();
      handleModalClose();
    } catch (error) {
      toast.error("Error submitting task");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTasks = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(res.statusText);

      // Eliminar la tarea del estado sin volver a cargar todo
      setTasks((prevTasks) => ({
        ...prevTasks,
        [task.state]: prevTasks[task.state].filter((t) => t._id !== task._id),
      }));

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
