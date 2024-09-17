'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveStreak } from '@/app/actions'
import { Club, Diamond, Heart, Spade, Trophy } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { toast } from 'sonner'

const getSuitIcon = (suit: string) => {
	switch (suit) {
		case 'Spade':
			return <Spade />
		case 'Heart':
			return <Heart />
		case 'Diamond':
			return <Diamond />
		case 'Club':
			return <Club />
		default:
			return null
	}
}

const PlayingCard = ({
	card,
	result,
	isPlayer,
	index,
}: {
	card: PlayingCard
	result: GameResult
	isPlayer: boolean
	index: number
}) => {
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
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			style={{
				position: 'absolute',
				top: `${index * 20}px`,
				left: `${index * 27}px`,
				zIndex: index,
			}}
			className={`bg-black rounded-lg w-16 h-24 sm:w-20 sm:h-28 flex flex-col items-center p-2 border-2 sm:border-4 ${getBorderColor()} shadow-lg text-white`}
		>
			<div className="text-lg sm:text-xl font-bold self-start">{card.value}</div>
			<div className="text-3xl sm:text-4xl">{getSuitIcon(card.suit)}</div>
		</motion.div>
	)
}

export default function BlackjackGame({
	streaks,
}: {
	streaks: Array<{ name: string; count: number; created_at: Date }>
}) {
	const [playerHand, setPlayerHand] = useState<PlayingCard[]>([])
	const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
	const [deck, setDeck] = useState<PlayingCard[]>([])
	const [gameState, setGameState] = useState<GameResult>(null)
	const [streak, setStreak] = useState(0)
	const [playerName, setPlayerName] = useState('')
	const [isDealing, setIsDealing] = useState(false)
	const [isGameStarted, setIsGameStarted] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const cardAudioRef = useRef<HTMLAudioElement | null>(null)
	const mixingAudioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		cardAudioRef.current = new Audio('/card.mp3')
		mixingAudioRef.current = new Audio('/mixing.mp3')
	}, [])

	const playCardSound = useCallback(() => {
		if (cardAudioRef.current) {
			cardAudioRef.current.currentTime = 0
			cardAudioRef.current.play()
		}
	}, [])

	const playMixingSound = useCallback(() => {
		if (mixingAudioRef.current) {
			mixingAudioRef.current.currentTime = 0
			mixingAudioRef.current.play()
		}
	}, [])

	const initializeDeck = useCallback(() => {
		const suits = ['Spade', 'Heart', 'Diamond', 'Club']
		const values = [
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'J',
			'Q',
			'K',
			'A',
		]
		const newDeck = suits.flatMap(suit => values.map(value => ({ suit, value })))
		return shuffleDeck(newDeck)
	}, [])

	const shuffleDeck = (deck: PlayingCard[]) => {
		return [...deck].sort(() => Math.random() - 0.5)
	}

	const drawCard = useCallback(
		(currentDeck: PlayingCard[]): [PlayingCard, PlayingCard[]] => {
			const [drawnCard, ...remainingDeck] = currentDeck
			playCardSound()
			return [drawnCard, remainingDeck]
		},
		[playCardSound]
	)

	const startGame = useCallback(async () => {
		setIsGameStarted(true)
		setIsDealing(true)
		playMixingSound()
		const newPlayerHand: PlayingCard[] = []
		const newDealerHand: PlayingCard[] = []
		let newDeck = initializeDeck()

		const dealCard = async (
			setHand: React.Dispatch<React.SetStateAction<PlayingCard[]>>
		) => {
			const [card, updatedDeck] = drawCard(newDeck)
			newDeck = updatedDeck
			setHand(prevHand => [...prevHand, card])
			await new Promise(resolve => setTimeout(resolve, 500))
		}

		await dealCard(setPlayerHand)
		await dealCard(setDealerHand)
		await dealCard(setPlayerHand)

		setDeck(newDeck)
		setIsDealing(false)

		const playerValue = calculateHandValue(newPlayerHand)
		const dealerValue = calculateHandValue(newDealerHand)

		if (playerValue === 21) {
			endGame('win')
		} else if (dealerValue === 21) {
			endGame('lose')
		} else {
			setGameState(null)
		}
	}, [initializeDeck, drawCard, playMixingSound])

	const hit = async () => {
		if (deck.length > 0 && gameState === null && !isDealing) {
			setIsDealing(true)
			const [newCard, newDeck] = drawCard(deck)
			const newHand = [...playerHand, newCard]
			setPlayerHand(newHand)
			setDeck(newDeck)
			await new Promise(resolve => setTimeout(resolve, 500))
			setIsDealing(false)
			const newHandValue = calculateHandValue(newHand)
			if (newHandValue > 21) {
				endGame('lose')
			} else if (newHandValue === 21) {
				endGame('win')
			}
		}
	}

	const stand = async () => {
		if (gameState !== null || isDealing) return

		setIsDealing(true)
		let currentDealerHand = [...dealerHand]
		let currentDeck = [...deck]
		while (calculateHandValue(currentDealerHand) < 17 && currentDeck.length > 0) {
			const [newCard, newDeck] = drawCard(currentDeck)
			currentDealerHand = [...currentDealerHand, newCard]
			currentDeck = newDeck
			setDealerHand(currentDealerHand)
			await new Promise(resolve => setTimeout(resolve, 500))
		}
		setDeck(currentDeck)
		setIsDealing(false)
		const playerValue = calculateHandValue(playerHand)
		const dealerValue = calculateHandValue(currentDealerHand)
		if (dealerValue > 21 || playerValue > dealerValue) {
			endGame('win')
		} else if (playerValue < dealerValue) {
			endGame('lose')
		} else {
			endGame('tie')
		}
	}

	const calculateHandValue = (hand: PlayingCard[]) => {
		let value = 0
		let aces = 0
		for (const card of hand) {
			if (card.value === 'A') {
				aces += 1
				value += 11
			} else if (['K', 'Q', 'J'].includes(card.value)) {
				value += 10
			} else {
				value += parseInt(card.value)
			}
		}
		while (value > 21 && aces > 0) {
			value -= 10
			aces -= 1
		}
		return value
	}

	const endGame = (result: GameResult) => {
		setGameState(result)
		if (result === 'win') {
			setStreak(prevStreak => prevStreak + 1)
		} else if (result === 'lose') {
			setStreak(0)
		}
	}

	const playAgain = () => {
		setPlayerHand([])
		setDealerHand([])
		setDeck([])
		setGameState(null)
		startGame()
	}

	const submitStreak = async () => {
		if (streak > 0 && playerName.trim() !== '') {
			setIsSubmitting(true)
			await saveStreak(streak, playerName)
			setStreak(0)
			toast.success('Your score has been submitted!')
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center sm:p-4">
			<Card className="sm:min-h-full min-h-dvh w-full sm:border border-0 rounded-none sm:max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500 sm:rounded-2xl overflow-hidden">
				<CardHeader className="bg-blue-500 p-6">
					<CardTitle className="text-4xl sm:text-5xl text-center font-bold text-white">
						Blackjack
					</CardTitle>
					<CardDescription className="text-center text-lg sm:text-xl text-blue-100">
						Try to win as many games in a row!
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					{!isGameStarted ? (
						<div className="flex justify-center pt-6 px-6">
							<Button
								onClick={startGame}
								className="w-full bg-blue-500 hover:bg-blue-500 text-white text-lg py-6 px-8 rounded-full transform transition-all hover:scale-105 hover:shadow-lg"
							>
								Start Game
							</Button>
						</div>
					) : (
						<div className="relative">
							<div className="grid gap-4 p-4 pt-0 mb-4 text-white">
								<div className="relative flex flex-col items-center gap-1">
									<h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
										Dealer
									</h3>
									<div className="relative flex justify-center items-center w-full h-[200px]">
										<div className="relative w-[175px] h-full">
											<AnimatePresence>
												{dealerHand.map((card, index) => (
													<PlayingCard
														key={index}
														card={card}
														result={gameState}
														isPlayer={false}
														index={index}
													/>
												))}
											</AnimatePresence>
										</div>
									</div>
									<div className="absolute bottom-0 text-2xl font-bold">
										{calculateHandValue(dealerHand)}
									</div>
								</div>
								<Separator className="bg-blue-500 opacity-50" />
								<div className="relative flex flex-col items-center gap-1">
									<h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
										You
									</h3>
									<div className="relative flex justify-center items-center w-full h-[200px]">
										<div className="relative w-[175px] h-full">
											<AnimatePresence>
												{playerHand.map((card, index) => (
													<PlayingCard
														key={index}
														card={card}
														result={gameState}
														isPlayer={true}
														index={index}
													/>
												))}
											</AnimatePresence>
										</div>
									</div>
									<div className="absolute bottom-0 text-2xl font-bold">
										{calculateHandValue(playerHand)}
									</div>
								</div>
							</div>

							{gameState === null && (
								<div className="flex justify-center sm:flex-row flex-col gap-4 mb-8 sm:px-6">
									<div className="w-full flex gap-4 items-center">
										<Button
											onClick={hit}
											disabled={gameState !== null || isDealing}
											className="w-full bg-green-500 text-white border-none py-6 px-8 rounded-full text-lg transform transition-all hover:scale-105 hover:bg-green-600 disabled:opacity-50"
										>
											Hit
										</Button>
										<Button
											onClick={stand}
											disabled={gameState !== null || isDealing}
											className="w-full bg-red-500 text-white border-none py-6 px-8 rounded-full text-lg transform transition-all hover:scale-105 hover:bg-red-600 disabled:opacity-50"
										>
											Stand
										</Button>
									</div>
									<Button
										variant="outline"
										className="sm:w-auto w-full rounded-full py-6 px-8 text-lg cursor-default"
									>
										Wins: {streak}
									</Button>
								</div>
							)}
						</div>
					)}

					{gameState !== null && (
						<div className="flex justify-center sm:flex-row flex-col gap-4 mb-8 sm:px-6">
							<div className="w-full flex sm:flex-row flex-col gap-4 items-center">
								<Button
									onClick={playAgain}
									className="w-full bg-blue-500 text-white border-none py-6 px-8 rounded-full text-lg hover:bg-blue-600"
								>
									Play Again
								</Button>
								{streak > 0 && (
									<Popover>
										<PopoverTrigger asChild>
											<Button className="w-full bg-purple-500 text-white border-none py-6 px-8 rounded-full text-lg hover:bg-purple-600">
												Submit Streak
											</Button>
										</PopoverTrigger>
										<PopoverContent className="bg-gradient-to-b from-gray-900 to-gray-800 border-gray-600">
											<div className="pb-4">
												<Label htmlFor="name" className="text-blue-300">
													Name
												</Label>
												<Input
													id="name"
													value={playerName}
													maxLength={25}
													required
													onChange={e => setPlayerName(e.target.value)}
													className="bg-gray-700 mt-1 text-white border-gray-500 focus:border-gray-400"
												/>
											</div>
											<Button
												onClick={submitStreak}
												disabled={isSubmitting}
												className="w-full bg-blue-500 text-white hover:bg-blue-600"
											>
												Submit {streak} {streak > 1 ? 'wins' : 'win'}
											</Button>
										</PopoverContent>
									</Popover>
								)}
							</div>
							<Button
								variant="outline"
								className="sm:w-auto w-full rounded-full py-6 px-8 text-lg cursor-default"
							>
								Wins: {streak}
							</Button>
						</div>
					)}

					<div className="mt-8">
						<Accordion type="single" collapsible className="text-white sm:px-6">
							<AccordionItem value="streaks" className="border-b-0">
								<AccordionTrigger>
									<div className="flex gap-3 items-center">
										<Trophy className="size-5 text-yellow-500" />
										Top 5 Streaks
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent text-base border-b border-blue-500">
												<TableHead className="min-w-[50px] text-blue-300">#</TableHead>
												<TableHead className="min-w-[125px] text-blue-300">Name</TableHead>
												<TableHead className="min-w-[150px] text-blue-300">Date</TableHead>
												<TableHead className="text-blue-300">Streak</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{streaks.map((streak, index) => (
												<TableRow
													className={`hover:bg-transparent text-base ${
														index === 0 ? 'text-yellow-400' : ''
													} ${index === 1 ? 'text-gray-300' : ''} ${
														index === 2 ? 'text-orange-400' : ''
													}`}
													key={index}
												>
													<TableCell>{index + 1}</TableCell>
													<TableCell>{streak.name}</TableCell>
													<TableCell>
														<time
															title={format(streak.created_at, 'yyyy-MM-dd')}
															dateTime={format(streak.created_at, 'yyyy-MM-dd')}
														>
															{formatDistanceToNowStrict(streak.created_at, {
																addSuffix: true,
															})}
														</time>
													</TableCell>
													<TableCell>
														{streak.count} {streak.count > 1 ? 'Wins' : 'Win'}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
