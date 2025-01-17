import { Button } from '@/components/ui/button'
import { SubmitStreak } from './SubmitStreak'
import { motion } from 'motion/react'
import { PlusIcon, HandIcon, PlayIcon } from 'lucide-react'
import { useEffect } from 'react'

export function ControlPanel({
	gameState,
	isDealing,
	streak,
	hit,
	stand,
	playAgain,
	resetStreak,
}: ControlPanelProps) {
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (document.activeElement?.tagName === 'INPUT') return

			if (gameState === null && !isDealing) {
				if (e.key === 'q') hit()
				if (e.key === 'w') stand()
			} else if (gameState !== null) {
				if (e.key === 'e' || e.key === ' ') playAgain()
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [gameState, isDealing, hit, stand, playAgain])

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
		>
			<div className="flex gap-4 w-full">
				{gameState === null ? (
					<div className="flex sm:flex-row flex-col w-full gap-4">
						<Button
							onClick={hit}
							disabled={gameState !== null || isDealing}
							className="w-full bg-emerald-600 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-105 hover:bg-emerald-700 disabled:opacity-50"
						>
							<PlusIcon className="size-6" />
							Hit
						</Button>
						<Button
							onClick={stand}
							disabled={gameState !== null || isDealing}
							className="w-full bg-rose-600 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-105 hover:bg-rose-700 disabled:opacity-50"
						>
							<HandIcon className="size-6" />
							Stand
						</Button>
					</div>
				) : (
					<div className="flex sm:flex-row flex-col w-full gap-4">
						<Button
							onClick={playAgain}
							className="w-full bg-blue-600 text-white border-none py-6 px-8 rounded-lg text-lg hover:bg-blue-700"
						>
							<PlayIcon className="size-6" />
							Play Again
						</Button>
						{streak > 0 && <SubmitStreak streak={streak} onSubmit={resetStreak} />}
					</div>
				)}
			</div>
		</motion.div>
	)
}
