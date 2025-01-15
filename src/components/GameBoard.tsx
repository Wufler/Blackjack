import { PlayingCard } from './PlayingCard'
import { AnimatePresence } from 'motion/react'
import { Trophy } from 'lucide-react'
import NumberFlow from '@number-flow/react'

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
				<div
					className={`text-lg font-semibold flex justify-center items-end gap-2 ${
						title === 'You' ? 'text-white' : 'text-blue-400'
					}`}
				>
					<NumberFlow
						value={calculateHandValue(hand)}
						className="text-2xl font-bold"
					/>
					<span className="opacity-50">{title}</span>
				</div>
				{isPlayer && streak !== undefined && (
					<div className="px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2">
						<Trophy className="text-yellow-400 size-5" />
						<NumberFlow value={streak} />
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
		</div>
	)
}
