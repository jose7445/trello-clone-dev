"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/AddTaskForm";
import { toast } from "react-hot-toast";
import TaskColumns from "./_components/TaskColumns"; // Importa el nuevo componenteç
import { useCurrentUser } from "@/hooks/useCurrentUser"; // Importa el hook personalizado

const DashboardPage = () => {
  const { userId, session } = useCurrentUser(); // Obtén el userId del hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Nueva tarea seleccionada
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null); // Limpia la tarea seleccionada
  };

  const handleModalOpen = (task = null) => {
    setSelectedTask(task); // Establece la tarea seleccionada (si existe)
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
      const url = selectedTask
        ? `/api/tasks/${selectedTask._id}` // Para edición
        : "/api/tasks"; // Para creación

      const ownerId = session.user.id;
      const taskDataWithOwner = {
        ...values,
        owner: ownerId, // No es necesario enviar el `id`, solo los campos
      };

      const method = selectedTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDataWithOwner),
      });

      if (!res.ok) throw new Error(res.statusText);

      toast.success(selectedTask ? "Task updated" : "Task added");
      fetchTasks(); // Recargar tareas
      handleModalClose();
    } catch (error) {
      console.error("Error saving task:", error);
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    try {
      // Hacer la solicitud DELETE a la API
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
      });

      // Verificar si la respuesta fue correcta
      if (!res.ok) throw new Error(res.statusText);

      // Mostrar un mensaje de éxito
      toast.success("Task deleted");

      // Recargar las tareas después de eliminar
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
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
          onClick={() => handleModalOpen()}
        >
          ADD TASK
        </Button>
      </div>

      {/* Modal */}
      <AddTask
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        task={selectedTask} // Pasa la tarea seleccionada al formulario
      />

      {/* Columnas de tareas */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TaskColumns
          title="To Do"
          tasks={tasks.todo}
          onEdit={handleModalOpen}
          onDelete={handleDelete}
        />
        <TaskColumns
          title="In Progress"
          tasks={tasks.inProgress}
          onEdit={handleModalOpen}
          onDelete={handleDelete}
        />
        <TaskColumns
          title="Done"
          tasks={tasks.done}
          onEdit={handleModalOpen}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
