"use client";
import React from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
const NavBar = () => {
  const start = (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.webp"
        alt="Picture of the author"
        width={80}
        height={80}
      />
    </div>
  );

  const end = (
    <div className="flex">
      {/*      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      /> */}
      <Link href="/login">
        <Button
          label="Log in"
          size="small"
          className="text-primary mr-4 text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Link>

      <Link href="/register">
        <Button
          label="Register"
          size="small"
          className="bg-primary text-white text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Link>
    </div>
  );

  return (
    <div className="card">
      <Menubar start={start} end={end} />
    </div>
  );
};

export default NavBar;
