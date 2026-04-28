import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Job Chronicle — 就活管理アプリ',
  description: '企業管理・選考スケジュール・ES管理まで。就活を丁寧に積み重ねる、あなただけの就活手帳。',
  keywords: ['就活', '就職活動', '企業管理', '選考管理', 'インターン'],
  openGraph: {
    title: 'My Job Chronicle',
    description: '就活を丁寧に積み重ねる、あなただけの就活手帳。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
