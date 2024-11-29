"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddTaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
      .min(3, "Description must be at least 3 characters")
      .required("Description is required"),
    state: Yup.string().required("State is required"),
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      initialFocusEl={() => ref.current}
    >
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-700 text-2xl font-semibold">
            {task ? "EDIT TASK" : "ADD NEW TASK"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Formik
            initialValues={{
              title: task?.title || "",
              description: task?.description || "",
              state: task?.state || "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize // Recalcula valores cuando cambia la tarea
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-bold text-gray-900"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-700 text-xs font-semibold mt-1">
                      {errors.title}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-bold text-gray-900"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-700 text-xs font-semibold mt-1">
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-bold text-gray-900"
                  >
                    State
                  </label>
                  <NativeSelectRoot size="sm">
                    <NativeSelectField
                      id="state"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      placeholder="Select option"
                      className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="to do">To Do</option>
                      <option value="in progress">In Progress</option>
                      <option value="done">Done</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </div>

                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button
                      className="text-primary text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </DialogActionTrigger>
                  <Button
                    className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            )}
          </Formik>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddTaskModal;
