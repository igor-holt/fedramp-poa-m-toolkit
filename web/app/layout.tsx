import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FedRAMP POA&M Toolkit | Genesis Conductor',
  description: 'Professional FedRAMP POA&M builder with Google Drive export',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}