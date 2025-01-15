import { Button } from '@/components/ui/button'
import { SubmitStreak } from './SubmitStreak'
import { motion } from 'motion/react'

export function ControlPanel({
	gameState,
	isDealing,
	streak,
	hit,
	stand,
	playAgain,
	resetStreak,
}: ControlPanelProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8"
		>
			<div className="flex gap-4 w-full">
				{gameState === null ? (
					<>
						<Button
							onClick={hit}
							disabled={gameState !== null || isDealing}
							className="w-full bg-green-500 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-105 hover:bg-green-600 disabled:opacity-50"
						>
							Hit
						</Button>
						<Button
							onClick={stand}
							disabled={gameState !== null || isDealing}
							className="w-full bg-red-500 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-105 hover:bg-red-600 disabled:opacity-50"
						>
							Stand
						</Button>
					</>
				) : (
					<>
						<Button
							onClick={playAgain}
							className="w-full bg-blue-500 text-white border-none py-6 px-8 rounded-lg text-lg hover:bg-blue-600"
						>
							Play Again
						</Button>
						{streak > 0 && <SubmitStreak streak={streak} onSubmit={resetStreak} />}
					</>
				)}
			</div>
		</motion.div>
	)
}
