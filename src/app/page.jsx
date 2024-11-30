"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center justify-center flex-col pt-40 pb-20">
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl md:text-6xl text-center text-neutral-800 font-bold">
            Planify
          </h1>

          <div>
            <Image
              src="/logo_camaleonicanalytics.webp"
              alt="Logo Camaleonic Analytics"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="text-3xl md:text-6xl text-center bg-gradient-to-r from-[#11253e] to-[#1e3a5f] text-white px-6 py-4 rounded-lg shadow-lg w-fit mx-auto mb-4">
          work forward
        </div>
      </div>

      <div className="text-sm md:text-lg text-neutral-500  max-w-xs md:max-w-2xl text-center mb-4">
        Stay organized and boost productivity with our collaborative task
        management app, perfect for teams and individuals alike!
      </div>

      {session ? (
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
              DASHBOARD
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
              JOIN US
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
