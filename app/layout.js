import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XinchaoNewsLetter - Daily Vietnam & Korea News",
  description: "Aggregated daily news from Vietnam and Korea, focusing on society, economy, and culture.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <div id="site-header"><Header /></div>
        <main className="flex-grow">
          {children}
        </main>
        <div id="site-footer"><Footer /></div>
      </body>
    </html>
  );
}
