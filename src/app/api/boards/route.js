import { NextResponse } from "next/server";
import Board from "@/models/board";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    await connectDB();
    // Obtener la sesión del usuario (esto depende de cómo manejes la sesión)
    const session = await getServerSession(req); // Asumiendo que tienes una función getSession que extrae el email del usuario

    if (!session || !session.user?.email) {
      return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
        status: 401,
      });
    }

    const { email } = session.user;

    // Buscar los boards donde el campo 'createdBy' coincide con el email del usuario
    const boards = await Board.find({ createdBy: email });

    // Retornar los boards de ese usuario
    return new NextResponse(JSON.stringify(boards), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ error: "Error al obtener los boards" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const { title, description, createdByEmail } = await req.json(); // Parse the JSON body
    await connectDB();
    // Validar que el usuario existe a partir del email

    // Crear un nuevo board
    const newBoard = new Board({
      title,
      description,
      createdBy: createdByEmail, // Usamos el email del usuario
    });

    await newBoard.save();

    // Retornar la respuesta con el nuevo board
    return new Response(JSON.stringify(newBoard), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Error al crear el board" }), {
      status: 500,
    });
  }
}
