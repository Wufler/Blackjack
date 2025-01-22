import { motion, AnimatePresence } from 'motion/react'
import { Club, Diamond, Heart, Spade } from 'lucide-react'

const getSuitIcon = (suit: string) => {
	switch (suit) {
		case 'Spade':
			return <Spade className="text-gray-200 size-7" strokeWidth={3} />
		case 'Heart':
			return <Heart className="text-red-500 size-7" strokeWidth={3} />
		case 'Diamond':
			return <Diamond className="text-red-500 size-7" strokeWidth={3} />
		case 'Club':
			return <Club className="text-gray-200 size-7" strokeWidth={3} />
		default:
			return null
	}
}

export function PlayingCard({
	card,
	result,
	isPlayer,
	index,
	isDealing,
}: PlayingCardProps) {
	const getBorderColor = () => {
		if (isDealing) return 'border-blue-500'
		if (result === null) return 'border-blue-500'
		if (result === 'tie') return 'border-orange-500'
		if (isPlayer) {
			return result === 'win' ? 'border-green-500' : 'border-red-500'
		} else {
			return result === 'lose' ? 'border-green-500' : 'border-red-500'
		}
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{
				duration: 0.4,
				delay: index * 0.1,
				layout: { duration: 0.3 },
			}}
			style={{
				position: 'absolute',
				top: `${index * 15}px`,
				left: `${index * 30}px`,
				zIndex: index,
			}}
		>
			<AnimatePresence mode="wait">
				{card.hidden ? (
					<motion.div
						key="hidden"
						initial={{ rotateY: 0 }}
						exit={{ rotateY: 90 }}
						transition={{ duration: 0.2 }}
						className="bg-gradient-to-t from-blue-900 to-blue-700 rounded-lg w-16 h-24 sm:w-20 sm:h-28 flex items-center justify-center border-4 border-blue-500 shadow-lg"
					>
						<div className="text-blue-200 text-4xl font-bold">?</div>
					</motion.div>
				) : (
					<motion.div
						key="revealed"
						initial={{ rotateY: -90 }}
						animate={{ rotateY: 0 }}
						transition={{ duration: 0.2 }}
						className={`bg-gradient-to-t to-gray-900 from-gray-700 rounded-lg w-16 h-24 sm:w-20 sm:h-28 flex flex-col items-center justify-between p-2 border-4 ${getBorderColor()} shadow-lg relative`}
					>
						<div
							className={`text-lg sm:text-2xl font-bold absolute top-1 left-2 ${
								card.suit === 'Heart' || card.suit === 'Diamond'
									? 'text-red-500'
									: 'text-gray-200'
							}`}
						>
							{card.value}
						</div>
						<div className="text-3xl sm:text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							{getSuitIcon(card.suit)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
