import { PlayingCard } from './PlayingCard'
import { AnimatePresence, motion } from 'motion/react'
import { Trophy } from 'lucide-react'

export function GameBoard({
	playerHand,
	dealerHand,
	gameState,
	calculateHandValue,
	streak,
}: GameBoardProps) {
	return (
		<div className="grid gap-8">
			<HandDisplay
				title="Dealer"
				hand={dealerHand}
				gameState={gameState}
				isPlayer={false}
				calculateHandValue={calculateHandValue}
				streak={streak}
			/>
			<HandDisplay
				title="You"
				hand={playerHand}
				gameState={gameState}
				isPlayer={true}
				calculateHandValue={calculateHandValue}
				streak={streak}
			/>
		</div>
	)
}

function HandDisplay({
	title,
	hand,
	gameState,
	isPlayer,
	calculateHandValue,
	streak,
}: HandDisplayProps) {
	return (
		<div className="relative">
			<div className="flex items-center justify-between mb-4">
				<h3
					className={`text-2xl font-semibold ${
						title === 'You' ? 'text-white' : 'text-blue-400'
					}`}
				>
					{title}
				</h3>
				{isPlayer && streak !== undefined && (
					<div className="px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2">
						<Trophy className="text-yellow-400 size-5" /> {streak}
					</div>
				)}
			</div>
			<div className="relative h-[150px] sm:h-[200px]">
				<AnimatePresence>
					{hand.map((card, index) => (
						<PlayingCard
							key={`${card.suit}-${card.value}`}
							card={card}
							result={gameState}
							isPlayer={isPlayer}
							index={index}
						/>
					))}
				</AnimatePresence>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="absolute bottom-0 left-auto right-0 md:right-auto md:left-0 text-2xl font-bold bg-gray-700 text-white px-3 py-1 rounded-lg"
			>
				{calculateHandValue(hand)}
			</motion.div>
		</div>
	)
}
