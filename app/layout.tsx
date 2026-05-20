import type { Metadata } from 'next'
import { Syne, DM_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'BD Track — Wolvio Pipeline Intelligence',
  description: 'Internal BD pipeline tracker for Wolvio Solutions',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmMono.variable} ${instrumentSans.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text antialiased font-body">
        {children}
      </body>
    </html>
  )
}
