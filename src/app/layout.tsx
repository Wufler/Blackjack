import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Blackjack',
	description:
		'Try to build up a streak and submit your score to the leaderboard!',
	metadataBase: new URL('https://blackyjack.vercel.app'),
	openGraph: {
		title: 'Blackjack',
		description:
			'Try to build up a streak and submit your score to the leaderboard!',
		url: 'https://blackyjack.vercel.app',
		images: [
			{
				url: '/cover.png',
				width: 1920,
				height: 1080,
				alt: 'Blackjack thumbnail',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<Toaster position="bottom-center" />
			</body>
		</html>
	)
}
