import { NextResponse } from "next/server";
import Task from "@/models/task";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth-options";
async function getSessionAndConnectDB() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session;
}

export async function GET(request) {
  try {
    const session = await getSessionAndConnectDB();

    const tasks = await Task.find({ owner: session.user.id });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, description, state, owner } = await request.json();

    const session = await getSessionAndConnectDB();

    if (!title || !description || !state) {
      return NextResponse.json(
        { message: "All fields (title, description, state) are required" },
        { status: 400 }
      );
    }

    const newTask = new Task({
      title,
      description,
      state,
      owner: session.user.id,
    });

    const savedTask = await newTask.save();

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
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
