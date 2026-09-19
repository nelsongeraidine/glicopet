import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlicoPet",
  description: "Monitoramento glicêmico do seu melhor amigo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-[#F8F7FC] bg-repeat text-[#252333]"
        style={{ backgroundImage: "url('/papel-de-parede.jpg')", backgroundSize: "340px auto" }}
      >
        {children}
      </body>
    </html>
  );
}
