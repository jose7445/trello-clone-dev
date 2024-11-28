import { NextResponse } from "next/server";
import Task from "@/models/task"; // El modelo de tarea
import { connectDB } from "@/libs/mongodb"; // Conexión a la base de datos

export async function POST(request) {
  try {
    // Obtenemos los datos de la tarea desde el body de la solicitud
    const { title, description, state, owner } = await request.json();

    // Conectamos a la base de datos
    await connectDB();

    // Verificamos que todos los campos estén presentes
    if (!title || !description || !state) {
      return NextResponse.json(
        { message: "All fields (title, description, state) are required" },
        { status: 400 }
      );
    }

    // Creamos la nueva tarea con Mongoose
    const newTask = new Task({
      title,
      description,
      state,
      owner,
    });

    // Guardamos la tarea
    const savedTask = await newTask.save();

    // Respondemos con la tarea guardada
    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    // Manejo de errores de Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ message: errors.join(", ") }, { status: 400 });
    }

    // Manejo de errores generales
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
