import '../app/globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>AI Talk</title>
      </head>
      <body>{children}</body>
    </html>
  )
}