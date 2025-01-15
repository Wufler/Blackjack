import { motion } from 'motion/react'
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
}: PlayingCardProps) {
	const getBorderColor = () => {
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
			initial={{ opacity: 0, y: 50, rotateY: 180 }}
			animate={{ opacity: 1, y: 0, rotateY: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			style={{
				position: 'absolute',
				top: `${index * 15}px`,
				left: `${index * 30}px`,
				zIndex: index,
			}}
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
	)
}
