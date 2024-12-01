export { default } from "next-auth/middleware";

// Protect only paths that match "/dashboard/:path*"
export const config = {
  matcher: ["/dashboard/:path*"],
};
