import type { Metadata } from "next";
import { Inter, Nunito, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pagee Hub",
  description: "One-page business profile generator for entrepreneurs",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="http://real-timee.vercel.app/widget.js" data-site-token="rtw_e1c5f3a67eab4e628cf61435c7f015f6" data-brand-color="#34d083"></script>
      </body>
    </html>
  );
}
