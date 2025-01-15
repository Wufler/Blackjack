import Github from './ui/github'

export default function Footer() {
	return (
		<footer className="fixed bottom-0 w-full md:bg-none bg-gray-800 text-gray-300 py-4 px-6">
			<div className="container mx-auto flex items-center justify-between md:justify-around md:py-4">
				<div>
					<p>&copy; 2025 Wolfey</p>
				</div>
				<div className="flex items-center gap-4">
					<a href="https://github.com/WoIfey/Blackjack" target="_blank">
						<Github className="size-6" />
					</a>
				</div>
			</div>
		</footer>
	)
}
