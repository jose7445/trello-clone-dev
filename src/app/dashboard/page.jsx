"use client";

import { useSession } from "next-auth/react";
import React from "react";

function DashboardPage() {
  const { data: session, status } = useSession();
  console.log(session, status);
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

export default DashboardPage;
