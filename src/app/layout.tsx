import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BookProvider } from '@/context/BookContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookShelf",
  description: "Track your books effortlessly",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookProvider>
          {children}
        </BookProvider>
      </body>
    </html>
  )
}