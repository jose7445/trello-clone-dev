"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/FormTasks";
import { toast } from "react-hot-toast";
import TaskColumns from "./_components/TaskColumns";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "../../services/axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

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
      await api.put(`/tasks/${taskToMove._id}`, {
        ...taskToMove,
        state: destColumn,
      });

      toast.success("Task moved successfully");
    } catch (error) {
      toast.error("Error moving task");
      console.error(error);
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

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Droppable
            droppableId="todo"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="To Do"
                  tasks={tasks.todo}
                  onEdit={handleModalOpen}
                  onDelete={deleteTasks}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable
            droppableId="inProgress"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="In Progress"
                  tasks={tasks.inProgress}
                  onEdit={handleModalOpen}
                  onDelete={deleteTasks}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable
            droppableId="done"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskColumns
                  title="Done"
                  tasks={tasks.done}
                  onEdit={handleModalOpen}
                  onDelete={deleteTasks}
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
