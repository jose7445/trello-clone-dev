"use client";

import React, { useRef } from "react";
import { signIn } from "next-auth/react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

function RegisterPage() {
  const toast = useRef(null);
  const router = useRouter();

  // Validación con Yup
  const validationSchema = Yup.object({
    fullname: Yup.string()
      .required("Full name is required")
      .min(3, "Full Name must be at least 6 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Realiza la solicitud de registro
      const signupResponse = await axios.post("/api/auth/signup", {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      });

      // Intenta iniciar sesión con las credenciales recién registradas
      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: values.password,
        redirect: false,
      });

      if (res?.ok) {
        //toast
        setTimeout(() => {
          router.push("/dashboard");
        }, "2000");
      } else {
        //toast
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred";
      //toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-gray-900 text-3xl font-bold mb-2">Register</h2>
          <p className="text-gray-600 font-medium">
            Do you have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-500 hover:underline ml-1"
            >
              Login in now!
            </a>
          </p>
        </div>

        <Formik
          initialValues={{
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
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
              <div className="mb-4">
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullname && touched.fullname && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.fullname}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && touched.email && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && touched.password && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                REGISTER
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterPage;
