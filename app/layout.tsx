import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reddit Insights Dashboard",
  description: "Modern Reddit data visualization and analytics dashboard",
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
