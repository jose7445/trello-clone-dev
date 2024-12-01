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

async function findTaskById(taskId) {
  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
}

export async function PUT(request, { params }) {
  try {
    const { taskId } = await params;

    await getSessionAndConnectDB();

    const { title, description, state } = await request.json();

    if (
      (title === undefined || title.trim() === "") &&
      (description === undefined || description.trim() === "") &&
      state === undefined
    ) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { title, description, state },
      { new: true }
    );

    return NextResponse.json(
      {
        data: updatedTask,
        status: 200,
        message: "Task updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred",
        status: 500,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { taskId } = await params;

    await getSessionAndConnectDB();

    await findTaskById(taskId);

    await Task.findOneAndDelete({ _id: taskId });

    return NextResponse.json(
      {
        data: { taskId },
        status: 200,
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred",
        status: 500,
      },
      { status: 500 }
    );
  }
}
