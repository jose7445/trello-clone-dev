import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";

import "./globals.css";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl md:text-6xl text-center text-neutral-800 font-bold">
            Planify
          </h1>

          <div>
            <Image
              src="/logo.webp"
              alt="Picture of the author"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="text-3xl md:text-6xl text-center bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit my-6">
          work forward
        </div>
      </div>

      <div className="text-sm md:text-lg text-neutral-500  max-w-xs md:max-w-2xl text-center mb-4">
        Stay organized and boost productivity with our collaborative task
        management app, perfect for teams and individuals alike!
      </div>

      <Link href="/login">
        <Button className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          JOIN US
        </Button>
      </Link>
    </div>
  );
}
