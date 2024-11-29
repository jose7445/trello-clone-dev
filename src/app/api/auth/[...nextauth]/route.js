import NextAuth from "next-auth";
import { authOptions } from "../../../../libs/auth-options"; // Asegúrate de que el path es correcto

const handler = NextAuth(authOptions);

// Exporta los métodos para las solicitudes HTTP que Next.js espera
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
