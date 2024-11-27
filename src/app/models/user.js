import { Schema, model, models } from "mongoose";

// Definición del esquema de usuario
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email es requerido"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "El correo electrónico no es válido",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      select: false, // Esto evita que la contraseña se retorne en las respuestas de la API
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    fullname: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      minlength: [3, "El nombre completo debe tener al menos 3 caracteres"],
    },
  },
  {
    timestamps: true, // Añade las fechas de creación y actualización automáticamente
  }
);

// Crear el modelo de usuario si no existe
const User = models.User || model("User", userSchema);

export default User;
