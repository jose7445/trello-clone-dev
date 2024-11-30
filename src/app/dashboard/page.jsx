"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/FormTasks";
import { toast } from "react-hot-toast";
import TaskColumns from "./_components/TaskColumns";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "../../services/axios";

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalOpen = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const stateTitles = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",
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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
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
      setErrors({ submit: error.message });
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
      toast.success("Task deleted");
      getTasks();
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mt-4">
        <h1 className="text-2xl md:text-4xl text-left text-neutral-700 font-bold">
          Board 1
        </h1>
        <Button
          className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-2 rounded"
          onClick={() => handleModalOpen()}
        >
          ADD TASK
        </Button>
      </div>

      <AddTask
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        task={selectedTask}
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
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
