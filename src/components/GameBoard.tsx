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
	previousStreak,
	isDealing,
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
				previousStreak={previousStreak}
				isDealing={isDealing}
			/>
			<HandDisplay
				title="You"
				hand={playerHand}
				gameState={gameState}
				isPlayer={true}
				calculateHandValue={calculateHandValue}
				streak={streak}
				previousStreak={previousStreak}
				isDealing={isDealing}
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
	previousStreak,
	isDealing,
}: HandDisplayProps) {
	const values = calculateHandValue(hand)
	const showBothValues = values.soft !== values.hard && values.soft <= 21

	return (
		<div className="relative">
			<div className="flex items-center justify-between mb-4">
				<div
					className={`text-lg font-semibold flex justify-center items-end ${
						title === 'You' ? 'text-white' : 'text-blue-400'
					}`}
				>
					<div className="flex items-baseline">
						{showBothValues ? (
							<>
								<NumberFlow value={values.hard} className="text-2xl font-bold" />
								<span className="text-2xl font-bold mr-1">,</span>
								<NumberFlow value={values.soft} className="text-2xl font-bold" />
							</>
						) : (
							<NumberFlow value={values.best} className="text-2xl font-bold" />
						)}
					</div>
					<span className="opacity-50 ml-2">{title}</span>
				</div>
				{isPlayer && streak !== undefined && (
					<div className="rounded-lg text-lg font-semibold flex items-center gap-2">
						<Trophy className="text-yellow-400 size-5" />
						<div className="flex items-center gap-1">
							<NumberFlow value={streak} />
							{gameState === 'lose' && previousStreak > 0 && (
								<span className="opacity-50">({previousStreak})</span>
							)}
						</div>
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
							isDealing={isDealing}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}
