import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: true,
    },
    state: {
      type: String,
      enum: ["todo", "inProgress", "done"], // Puedes ajustar las columnas según tu necesidad
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Referencia a otro documento en la base de datos
      ref: "User", // Relación con el modelo de usuario
      required: true,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
