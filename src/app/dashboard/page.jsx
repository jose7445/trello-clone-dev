"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/AddTaskForm";
import { toast } from "react-hot-toast";
import TaskColumns from "./_components/TaskColumns"; // Importa el nuevo componente

const DashboardPage = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Función para obtener las tareas del usuario
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        toast.error("Failed to load tasks");
        throw new Error("Failed to load tasks");
      }
      const data = await res.json();

      // Filtrar las tareas según su estado
      const todoTasks = data.filter((task) => task.state === "to do") || [];
      const inProgressTasks =
        data.filter((task) => task.state === "in progress") || [];
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
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log(values);
      const ownerId = session.user.id;
      const taskDataWithOwner = {
        ...values,
        owner: ownerId,
      };
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDataWithOwner),
      });

      if (!res.ok) {
        toast.error(res.error || "Failed to add task");
        throw new Error(res.error || "Failed to add task");
      } else {
        const data = await res.json();
        toast.success("Task added");
        handleModalClose(true);
        setSubmitting(false);
        fetchTasks(); // Recargar tareas al agregar una nueva
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl md:text-4xl text-left text-neutral-800 font-bold">
          Board 1
        </h1>
        <Button
          className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleModalOpen}
        >
          ADD TASK
        </Button>
      </div>

      {/* Modal */}
      <AddTask
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />

      {/* Columnas de tareas */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-4">
          <TaskColumns title="To Do" tasks={tasks.todo} />
        </div>
        <div className="flex flex-col space-y-4">
          <TaskColumns title="In Progress" tasks={tasks.inProgress} />
        </div>
        <div className="flex flex-col space-y-4">
          <TaskColumns title="Done" tasks={tasks.done} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
