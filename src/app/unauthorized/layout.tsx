import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You are not authorized to access this content.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
