"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/FormTasks";
import { toast } from "react-hot-toast";
import TaskColumns from "./_components/TaskColumns"; // Importa el nuevo componenteç
import { useCurrentUser } from "@/hooks/useCurrentUser"; // Importa el hook personalizado
import api from "../../services/axios"; // Import the API methods
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Aquí en tu componente DashboardPage:
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

  const fetchTasks = async () => {
    try {
      // Use the GET method from the centralized api service
      const data = await api.get("/tasks");

      // Filter tasks by state (or provide default empty arrays)
      const todoTasks = data.filter((task) => task.state === "todo") || [];
      const inProgressTasks =
        data.filter((task) => task.state === "inProgress") || [];
      const doneTasks = data.filter((task) => task.state === "done") || [];

      // Update the state with the filtered tasks
      setTasks({
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks"); // Show error toast if something goes wrong
    }
  };

  useEffect(() => {
    if (session) fetchTasks();
  }, [session]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const url = selectedTask
        ? `/tasks/${selectedTask._id}` // PUT if task is selected
        : "/tasks"; // POST if no task is selected

      const ownerId = session.user.id;
      const taskDataWithOwner = { ...values, owner: ownerId };

      const method = selectedTask ? "put" : "post"; // Use 'put' or 'post' based on the presence of selectedTask

      // Make the API call using the centralized API methods (POST or PUT)
      const res = await api[method](url, taskDataWithOwner);

      toast.success(selectedTask ? "Task updated" : "Task added");

      fetchTasks(); // Refresh tasks list
      handleModalClose(); // Close modal after submission
    } catch (error) {
      // Handle any errors by setting error state
      setErrors({ submit: error.message });
      toast.error("Error submitting task");
      console.error(error); // Log error for debugging
    } finally {
      // Set submitting state to false after the API call
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(res.statusText);
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  // Función para manejar el cambio de tarea entre columnas
  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    // Si la tarea se mueve a la misma columna, no hacer nada
    if (sourceColumn === destColumn) return;

    const sourceTasks = tasks[sourceColumn];
    const destTasks = tasks[destColumn];
    const taskToMove = sourceTasks.find((task) => task._id === draggableId);

    // Eliminar la tarea de la columna original
    const updatedSourceTasks = sourceTasks.filter(
      (task) => task._id !== draggableId
    );
    const updatedDestTasks = [...destTasks, taskToMove];

    // Actualizar el estado de las tareas
    setTasks({
      ...tasks,
      [sourceColumn]: updatedSourceTasks,
      [destColumn]: updatedDestTasks,
    });

    try {
      // Usar el método PUT del API centralizado para mover la tarea
      await api.put(`/tasks/${taskToMove._id}`, {
        ...taskToMove,
        state: destColumn,
      });

      toast.success("Task moved successfully");
    } catch (error) {
      toast.error("Error moving task");
      console.error(error); // Log error for debugging
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl md:text-4xl text-left text-neutral-700 font-bold">
          Board 1
        </h1>
        <Button
          className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
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

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Droppable droppableId="todo">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="To Do"
                  tasks={tasks.todo}
                  onEdit={handleModalOpen}
                  onDelete={handleDelete}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="inProgress">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="In Progress"
                  tasks={tasks.inProgress}
                  onEdit={handleModalOpen}
                  onDelete={handleDelete}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="done">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="Done"
                  tasks={tasks.done}
                  onEdit={handleModalOpen}
                  onDelete={handleDelete}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default DashboardPage;
