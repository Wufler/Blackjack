import Github from './ui/github'
import { memo } from 'react'

export default memo(function Footer() {
	return (
		<footer className="w-full text-gray-300 py-4 px-6">
			<div className="flex items-center md:justify-evenly justify-between md:py-2">
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
})
