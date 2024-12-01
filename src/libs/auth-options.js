import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";

const ERROR_INVALID_CREDENTIALS = "Invalid credentials"; // Error for invalid credentials

export const authOptions = {
  providers: [
    // Credentials provider to authenticate using email and password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Function to authorize the user based on the provided credentials
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(ERROR_INVALID_CREDENTIALS);
        }

        await connectDB();

        // Find the user by email, selecting the password field
        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!userFound) throw new Error(ERROR_INVALID_CREDENTIALS); // Error if no user is found

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error(ERROR_INVALID_CREDENTIALS); // Error if password don't match

        return {
          id: userFound._id.toString(),
          email: userFound.email,
          fullname: userFound.fullname,
        };
      },
    }),
  ],
  callbacks: {
    // Callback for JWT token generation
    async jwt({ user, token }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    // Callback to include user information in the session
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
    // Redirect to /login if the user is not authenticated
    signIn: "/login",
  },
};
