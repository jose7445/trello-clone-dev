import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { fullname, email, password } = await request.json();

    // Conectamos a la base de datos
    await connectDB();

    // Verificamos si el correo electrónico ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    // Hasheamos la contraseña
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creamos el nuevo usuario con Mongoose
    const user = new User({
      email,
      fullname,
      password: hashedPassword,
    });

    // Guardamos el usuario y dejamos que Mongoose valide los datos
    const savedUser = await user.save();

    // Respondemos con los datos del usuario creado (sin la contraseña)
    return NextResponse.json({
      email: savedUser.email,
      fullname: savedUser.fullname,
    });
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
