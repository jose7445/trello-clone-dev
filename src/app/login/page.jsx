"use client";

import React, { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Input } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { email, password } = values;

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res.ok) {
        toast.error(res.error || "Invalid Credentials");
        throw new Error(res.error || "Invalid Credentials");
      } else {
        console.log(res);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

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
        <div className="flex flex-col items-center justify-center pt-10 pb-40">
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 text-3xl font-bold mb-2">Log in</h2>
              <div className="text-gray-600 font-medium">
                No have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-blue-500 hover:underline ml-1"
                >
                  Register right now!
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <PasswordInput
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {errors.password && touched.password && (
                  <div className="text-red-700 text-xs font-semibold mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                LOG IN
              </Button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
