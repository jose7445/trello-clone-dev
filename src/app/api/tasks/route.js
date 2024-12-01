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
    const session = await getSessionAndConnectDB();

    const { title, description, state } = await request.json();

    if (!title || !description || !state) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          status: 400,
        },
        { status: 400 }
      );
    }

    const newTask = new Task({
      title,
      description,
      state,
      owner: session.user.id,
    });

    await newTask.save();

    return NextResponse.json(
      {
        data: newTask,
        status: 200,
        message: "Task created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred",
        status: 500,
      },
      { status: 500 }
    );
  }
}
