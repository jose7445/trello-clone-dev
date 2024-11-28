"use client";

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSession } from "next-auth/react";

const CreateBoard = ({ closeModal }) => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    console.error("User email is missing.");
    return; // Salir si no se encuentra el email del usuario
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/boards", {
        title: values.title,
        description: values.description,
        createdByEmail: userEmail,
      });
      console.log("Board created:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Title
            </label>
            <TextField
              id="title"
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <TextField
              id="description"
              type="textarea"
              name="description"
              multiline
              rows={4}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && touched.description && (
              <div className="text-red-700 text-xs font-semibold mt-1">
                {errors.description}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            CREATE BOARD
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default CreateBoard;
