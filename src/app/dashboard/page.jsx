// DashboardPage.js

"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AddTask from "./_components/AddTask";
import { toast } from "react-hot-toast";
const DashboardPage = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
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
        toast.error(res.error || "Failed to add task"); // Muestra un toast de error
        throw new Error(res.error || "Failed to add task");
      } else {
        const data = await res.json();
        toast.success("Task added");
        handleModalClose(true);

        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="px-6">
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

      <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* To Do Column */}
        <div className="bg-slate-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium text-neutral-700">To Do</h3>
          <div className="mt-3 space-y-2"></div>
        </div>

        {/* In Progress Column */}
        <div className="bg-slate-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium text-neutral-700">In Progress</h3>
          <div className="mt-3 space-y-2"></div>
        </div>

        {/* Done Column */}
        <div className="bg-slate-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium text-neutral-700">Done</h3>
          <div className="mt-3 space-y-2"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
