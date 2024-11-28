"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function ButtonAppBar() {
  const { data: session, status } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="bg-slate-800 text-white shadow-sm">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="font-bold"
          >
            <Link href="/">PLANIFY</Link>
          </Typography>

          {session ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold">{session.user.fullname}</span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-primary text-white text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                LOGOUT
              </Button>
            </div>
          ) : (
            <div>
              <Link href="/login">
                <Button className="text-primary mr-4 text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-white text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
