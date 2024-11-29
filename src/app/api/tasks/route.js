import { NextResponse } from "next/server";
import Task from "@/models/task"; // El modelo de tarea
import { connectDB } from "@/libs/mongodb"; // Conexión a la base de datos
import { getServerSession } from "next-auth"; // Importar getSession
import { authOptions } from "../auth/[...nextauth]/route"; // Asegúrate de importar las opciones de autenticación correctamente

// Función para obtener la sesión y conectar a la base de datos
async function getSessionAndConnectDB() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session;
}

// GET: Obtener todas las tareas del usuario
export async function GET(request) {
  try {
    const session = await getSessionAndConnectDB(); // Conectar a DB y verificar sesión

    const tasks = await Task.find({ owner: session.user.id }); // Buscar tareas por ID de usuario

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva tarea
export async function POST(request) {
  try {
    const { title, description, state, owner } = await request.json();

    // Conectar a la base de datos y verificar la sesión
    const session = await getSessionAndConnectDB();

    // Verificar que todos los campos estén presentes
    if (!title || !description || !state) {
      return NextResponse.json(
        { message: "All fields (title, description, state) are required" },
        { status: 400 }
      );
    }

    // Crear la nueva tarea
    const newTask = new Task({
      title,
      description,
      state,
      owner: session.user.id, // Asignar el ID del usuario de la sesión
    });

    const savedTask = await newTask.save(); // Guardar la tarea

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    // Manejo de errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ message: errors.join(", ") }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
