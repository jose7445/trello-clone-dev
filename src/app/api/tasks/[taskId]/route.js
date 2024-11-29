import { NextResponse } from "next/server";
import Task from "@/models/task"; // El modelo de tarea
import { connectDB } from "@/libs/mongodb"; // Conexión a la base de datos
import { getServerSession } from "next-auth"; // Importar getSession
import { authOptions } from "@/libs/auth-options"; // Asegúrate de importar las opciones de autenticación correctamente

// Función para obtener la sesión y verificarla
async function getSessionAndConnectDB() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session;
}

// Función para manejar la validación de la tarea
async function findTaskById(taskId) {
  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
}

// PUT: Actualizar una tarea específica por ID
export async function PUT(request, { params }) {
  try {
    // Espera para acceder a params
    const { taskId } = await params; // Asegúrate de usar await aquí

    await getSessionAndConnectDB(); // Conectar a DB y verificar sesión

    const { title, description, state } = await request.json();

    // Verificar que al menos uno de los campos de la tarea se haya enviado
    if (!title && !description && !state) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Buscar la tarea y actualizarla
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { title, description, state },
      { new: true }
    );

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una tarea específica por ID
export async function DELETE(request, { params }) {
  try {
    // Espera para acceder a params
    const { taskId } = await params; // Asegúrate de usar await aquí

    await getSessionAndConnectDB(); // Conectar a DB y verificar sesión

    // Buscar y eliminar la tarea
    await findTaskById(taskId); // Lanzará error si no se encuentra la tarea

    await Task.findOneAndDelete({ _id: taskId });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
