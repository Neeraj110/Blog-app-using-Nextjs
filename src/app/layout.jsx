import ClientProvider from "@/redux/clientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scoial Media",
  description: "A social media platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          className="pl-[4rem] pr-[2rem] mt-[1rem] text-[.8rem] md:p-0 "
          autoClose={1000}
        />
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
