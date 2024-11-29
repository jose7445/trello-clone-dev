import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Set the base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally, add an interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if it's successful
  (error) => {
    // Handle errors globally, you can add more specific error handling here
    return Promise.reject(error);
  }
);

// Reusable methods for different HTTP requests
const api = {
  get: async (url) => {
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error; // rethrow to handle error in the component
    }
  },

  post: async (url, data) => {
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  },

  put: async (url, data) => {
    try {
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      console.error("PUT request error:", error);
      throw error;
    }
  },

  delete: async (url) => {
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error("DELETE request error:", error);
      throw error;
    }
  },
};

export default api;
