// File: src/app/layout.jsx

import Authprovider from "@/context/authprovider";
import "./globals.css"; // Optional global styles
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login",
  description: "Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Authprovider>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
       {children}
      </body>
      </Authprovider>
    </html>
  );
}


