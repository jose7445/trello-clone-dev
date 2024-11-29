import { NextResponse } from "next/server";
import Task from "@/models/task"; // El modelo de tarea
import { connectDB } from "@/libs/mongodb"; // Conexión a la base de datos
import { getServerSession } from "next-auth"; // Importar getSession
import { authOptions } from "../../auth/[...nextauth]/route"; // Asegúrate de importar las opciones de autenticación correctamente

// PUT: Actualizar una tarea específica por ID
export async function PUT(request, { params }) {
  try {
    // Esperar a que los parámetros se resuelvan
    const { taskId } = await params; // Se debe usar await aquí

    await connectDB(); // Conectar a la base de datos

    const session = await getServerSession(authOptions); // Obtener la sesión del usuario

    if (!session) {
      return NextResponse.json(
        { message: "No session found" },
        { status: 401 }
      );
    }

    // Obtener los datos del cuerpo de la solicitud
    const { title, description, state } = await request.json(); // Suponemos que estos campos pueden ser actualizados

    // Verificar que al menos uno de los campos de la tarea se haya enviado
    if (!title && !description && !state) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Buscar la tarea por ID
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Actualizar la tarea con los nuevos datos
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { title, description, state }, // Campos que se pueden actualizar
      { new: true } // Devuelve la tarea actualizada
    );

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Extraer el ID de la tarea desde los parámetros de la URL
    const { taskId } = await params;

    await connectDB(); // Conectar a la base de datos

    const session = await getServerSession(authOptions); // Obtener la sesión del usuario

    if (!session) {
      return NextResponse.json(
        { message: "No session found" },
        { status: 401 }
      );
    }

    // Buscar la tarea por ID
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Eliminar la tarea
    await Task.findOneAndDelete({ _id: taskId });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
