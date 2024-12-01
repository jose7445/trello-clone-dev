import "./globals.css";
import Providers from "./utils/Providers";
import { Provider } from "@/components/ui/provider";
import { Barlow } from "next/font/google";
import NavBar from "./components/nav-bar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Planify",
  description:
    "Planify is a task and project management app that helps you organize your workflow.",
};

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlow.className} antialiased bg-slate-100`}>
        <Provider>
          <Providers>
            <NavBar />
            <Toaster position="bottom-center" reverseOrder={false} />
            <main className="bg-slate-100">{children}</main>
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
