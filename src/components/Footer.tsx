'use client'

import Github from './ui/github'
import { memo, useState } from 'react'
import { Keyboard } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

export default memo(function Footer() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<footer className="w-full text-gray-300 py-4 px-6">
			<div className="flex items-center md:justify-evenly justify-between md:py-2">
				<div>
					<p>&copy; 2025 Wolfey</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="md:flex items-center hidden">
						<Popover open={isOpen} onOpenChange={setIsOpen}>
							<PopoverTrigger asChild>
								<div
									className="flex items-center cursor-pointer popover-trigger"
									onMouseEnter={() => setIsOpen(true)}
									onMouseLeave={() => setIsOpen(false)}
								>
									<Keyboard className="size-6" />
								</div>
							</PopoverTrigger>
							<PopoverContent
								className="max-w-56 bg-gradient-to-b to-gray-800 from-gray-900 border-gray-700 p-4 rounded-lg shadow-lg"
								sideOffset={12}
								onMouseEnter={() => setIsOpen(true)}
								onMouseLeave={() => setIsOpen(false)}
							>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<div className="flex items-center justify-between">
											<span className="text-sm">Hit</span>
											<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
												<span className="text-xs">Q</span>
											</kbd>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Stand</span>
											<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
												<span className="text-xs">W</span>
											</kbd>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Play Again</span>
											<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
												<span className="text-xs">E / Space</span>
											</kbd>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
					<a
						href="https://github.com/WoIfey/Blackjack"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center"
					>
						<Github className="size-6" />
					</a>
				</div>
			</div>
		</footer>
	)
})
