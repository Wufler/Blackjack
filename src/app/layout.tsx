import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
	title: 'Blackjack',
	description: 'Try to win as many games in a row!',
	openGraph: {
		title: 'Blackjack',
		description: 'Try to win as many games in a row!',
		url: 'https://blackyjack.vercel.app',
		images: [
			{
				url: 'https://wolfey.s-ul.eu/c9wR8HWH',
				width: 1280,
				height: 720,
				alt: 'Thumbnail',
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
		<html lang="en">
			<body>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
