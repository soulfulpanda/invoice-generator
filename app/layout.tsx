import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { HeaderWrapper } from "@/components/header-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Invoice Generator - Generate Invoice For Free",
  description:
    "Use our Free Invoice Generator Tool to quickly generate invoices with our clean invoice template right on the web at zero cost",
  keywords:
    "generate invoice, invoice generator, invoice generator tool, bill generator free, free invoice generator, create free invoice, free bill generator",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <HeaderWrapper />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
