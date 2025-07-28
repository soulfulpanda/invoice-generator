import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoices Online",
  description:
    "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates, PDF export, and invoice management.",
  keywords: "invoice generator, free invoice, online invoice, invoice template, PDF invoice, business invoice",
  authors: [{ name: "Free Invoice Generator" }],
  creator: "Free Invoice Generator",
  publisher: "Free Invoice Generator",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description:
      "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates.",
    siteName: "Free Invoice Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description:
      "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
