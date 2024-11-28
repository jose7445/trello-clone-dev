import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

// Mensajes de error centralizados
const ERROR_INVALID_CREDENTIALS = "Invalid credentials";

const handler = NextAuth({
  // Configuración de proveedores
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password", placeholder: "****" },
      },
      async authorize(credentials) {
        // Validación inicial de credenciales
        if (!credentials?.email || !credentials?.password) {
          throw new Error(ERROR_INVALID_CREDENTIALS);
        }

        // Conexión a la base de datos
        await connectDB();

        // Buscar el usuario en la base de datos
        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");
        if (!userFound) throw new Error(ERROR_INVALID_CREDENTIALS);

        // Validar la contraseña
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );
        if (!passwordMatch) throw new Error(ERROR_INVALID_CREDENTIALS);

        // Retornar el usuario encontrado (omitimos la contraseña)
        return {
          id: userFound._id,
          email: userFound.email,
          fullname: userFound.fullname,
        };
      },
    }),
  ],

  // Callbacks personalizados
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Agregar datos del usuario al token
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user; // Transferir datos del token a la sesión
      return session;
    },
  },

  // Páginas personalizadas
  pages: {
    signIn: "/login", // Ruta de inicio de sesión
  },

  // Configuración adicional
  session: {
    strategy: "jwt", // Uso de JWT para sesiones
  },
});

export { handler as GET, handler as POST };
