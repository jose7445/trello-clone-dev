// hooks/useCurrentUser.js
import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  // Return an object with the user id, fullname, the session, and status
  return {
    userId: session?.user?.id,
    fullname: session?.user?.fullname,
    session,
    status,
  };
}
