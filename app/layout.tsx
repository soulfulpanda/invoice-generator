import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoices Online",
  description:
    "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates, PDF export, and invoice management.",
  keywords: "invoice generator, free invoice, online invoice, invoice template, PDF invoice, business invoice",
  authors: [{ name: "Invoice Generator Team" }],
  creator: "Invoice Generator",
  publisher: "Invoice Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description:
      "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates, PDF export, and invoice management.",
    url: "https://your-domain.com",
    siteName: "Free Invoice Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator - Create Professional Invoices Online",
    description:
      "Generate professional invoices for free. Easy-to-use online invoice generator with customizable templates, PDF export, and invoice management.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
