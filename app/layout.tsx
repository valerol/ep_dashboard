import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elephant Pants — дорожная карта проекта",
  description: "Подтверждённая история, текущий шаг и долгосрочная дорожная карта Elephant Pants.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
