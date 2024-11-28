"use client";

import React, { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const LoginForm = () => {
  const router = useRouter();
  const toast = useRef(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // onSubmit function extracted
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Start the loading state as soon as submit is clicked

      const { email, password } = values;

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res.ok) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.error,
          life: 3000,
        });
        throw new Error(res.error || "Invalid Credentials");
      } else {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Login success!",
          life: 3000,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

        // Stop loading if login is successful
        setLoading(false);
      }
    } catch (error) {
      setErrors({
        general: error.message || "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
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
        <div className="flex flex-col items-center justify-center ">
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 text-3xl font-bold mb-2">Log in</h2>
              <p className="text-gray-600 font-medium">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-blue-500 hover:underline ml-1"
                >
                  Register right now!
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Email
                </label>
                <InputText
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
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
                <InputText
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && touched.password && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <Toast ref={toast} />
              <Button
                type="submit"
                label="Log in"
                className="w-full text-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
