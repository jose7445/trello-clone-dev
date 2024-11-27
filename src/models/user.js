import { Schema, model, models } from "mongoose";

// Definición del esquema de usuario
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "El correo electrónico no es válido",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Esto evita que la contraseña se retorne en las respuestas de la API
      minlength: [6, "Password must be at least 6 characters"],
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters"],
    },
  },
  {
    timestamps: true, // Añade las fechas de creación y actualización automáticamente
  }
);

// Crear el modelo de usuario si no existe
const User = models.User || model("User", userSchema);

export default User;
