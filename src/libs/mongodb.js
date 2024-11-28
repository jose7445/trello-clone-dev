import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    return Promise.reject(new Error("MONGODB_URI is not defined"));
  }

  try {
    mongoose.set("strictQuery", false); // Para evitar advertencias sobre "strictQuery"
    const { connection } = await mongoose.connect(MONGODB_URI);

    if (connection.readyState === 1) {
      console.log("Connected to MongoDB");
      return Promise.resolve(true);
    } else {
      throw new Error("MongoDB connection not established");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return Promise.reject(error);
  }
};
