import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Header } from "@/components/header"

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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
