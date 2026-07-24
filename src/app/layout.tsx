import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "../lib/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

const roboto = Roboto({
  variable: "--font-poboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ABX system",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icons/big-tuna.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}  antialiased`}>
        <SpeedInsights />
        <Analytics/>
        <Providers>{children}</Providers>

        <Toaster
          toastOptions={{
            classNames: {
              error: "!bg-red-600 !text-white",
              success: "!bg-green-600 !text-white",
              warning: "!bg-yellow-500 !text-black",
            },
          }}
        />
      </body>
    </html>
  );
}
