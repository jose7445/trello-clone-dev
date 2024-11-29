import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb"; // Asegúrate de que el path es correcto

// Mensajes de error centralizados
const ERROR_INVALID_CREDENTIALS = "Invalid credentials";

// Configuración de NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(ERROR_INVALID_CREDENTIALS);
        }

        await connectDB();

        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!userFound) throw new Error(ERROR_INVALID_CREDENTIALS);

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error(ERROR_INVALID_CREDENTIALS);

        return {
          id: userFound._id.toString(),
          email: userFound.email,
          fullname: userFound.fullname,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
