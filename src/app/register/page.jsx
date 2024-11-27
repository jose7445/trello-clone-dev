"use client";

import React, { useState, useRef } from "react";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import axios from "axios";

function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        fullname,
        email,
        password,
      });
      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Message Content",
          life: 3000,
        });
        return;
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.message,
          life: 3000,
        });
        return;
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred";

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-gray-900 text-3xl font-semibold mb-2">Log in</h2>
          <p className="text-gray-600 font-medium">
            Don't have an account?
            <a
              href="#"
              className="font-medium text-blue-500 hover:underline ml-1"
            >
              Register right now!
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-900 font-medium mb-1"
            >
              fullname
            </label>
            <input
              id="fullname"
              type="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="User name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-900 font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-900 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minlength="6"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-900 font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Toast ref={toast} />
          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
