"use client";

import { useSession } from "next-auth/react";
import React from "react";

function DashboardPage() {
  const { data: session, status } = useSession();
  console.log(session, status);
  return <div>DashboardPage</div>;
}

export default DashboardPage;
