'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameBoard } from './GameBoard'
import { ControlPanel } from './ControlPanel'
import { LeaderBoard } from './LeaderBoard'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './ui/button'
import Footer from './Footer'

export default function BlackjackGame({ streaks }: { streaks: Streak[] }) {
	const [isGameStarted, setIsGameStarted] = useState(false)
	const { playCardSound, playMixingSound } = useSoundEffects()
	const {
		playerHand,
		dealerHand,
		gameState,
		streak,
		isDealing,
		hit,
		stand,
		startGame,
		playAgain,
		calculateHandValue,
		resetStreak,
	} = useGameLogic(playCardSound, playMixingSound)

	useEffect(() => {
		if (isGameStarted) {
			startGame()
		}
	}, [isGameStarted, startGame])

	return (
		<>
			<div className="min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 text-white flex md:items-center justify-center md:p-8 md:shadow-xl">
				<Card className="w-full max-w-4xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-none md:border-blue-500 md:rounded-lg overflow-hidden shadow-2xl">
					<CardContent className="p-8">
						<div className="md:flex md:flex-row md:gap-6">
							<div className="md:hidden w-full">
								<Tabs defaultValue="game" className="w-full">
									<TabsList className="grid w-full grid-cols-2 bg-transparent">
										<TabsTrigger value="game" className="data-[state=active]:bg-blue-500">
											Game
										</TabsTrigger>
										<TabsTrigger
											value="leaderboard"
											className="data-[state=active]:bg-blue-500"
										>
											Leaderboard
										</TabsTrigger>
									</TabsList>
									<TabsContent value="game" className="mt-4">
										<AnimatePresence mode="wait">
											{!isGameStarted ? (
												<motion.div
													key="start"
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -20 }}
													transition={{ duration: 0.1 }}
													className="flex flex-col items-center justify-center h-full text-white py-10"
												>
													<h1 className="text-5xl font-bold text-center mb-4 md:mb-6">
														Blackjack
													</h1>
													<p className="text-xl text-center mb-4 md:mb-6">
														Try to beat the current highest streak!
													</p>
													<Button
														onClick={() => setIsGameStarted(true)}
														className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-4 px-8 rounded-full transform transition-all"
													>
														Start Game
													</Button>
												</motion.div>
											) : (
												<motion.div
													key="game"
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -20 }}
													transition={{ duration: 0.5 }}
												>
													<GameBoard
														playerHand={playerHand}
														dealerHand={dealerHand}
														gameState={gameState}
														streak={streak}
														calculateHandValue={calculateHandValue}
													/>
													<ControlPanel
														gameState={gameState}
														isDealing={isDealing}
														streak={streak}
														hit={hit}
														stand={stand}
														playAgain={playAgain}
														resetStreak={resetStreak}
													/>
												</motion.div>
											)}
										</AnimatePresence>
									</TabsContent>
									<TabsContent value="leaderboard" className="mt-4">
										<LeaderBoard streaks={streaks} />
									</TabsContent>
								</Tabs>
							</div>

							<div className="hidden md:flex md:flex-row md:gap-6 w-full">
								<div className="flex-1">
									<AnimatePresence mode="wait">
										{!isGameStarted ? (
											<motion.div
												key="start"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												transition={{ duration: 0.1 }}
												className="flex flex-col items-center justify-center h-full text-white py-10"
											>
												<h1 className="text-5xl font-bold text-center mb-4 md:mb-6">
													Blackjack
												</h1>
												<p className="text-xl text-center mb-4 md:mb-6">
													Try to beat the current highest streak!
												</p>
												<Button
													onClick={() => setIsGameStarted(true)}
													className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-4 px-8 rounded-full transform transition-all"
												>
													Start Game
												</Button>
											</motion.div>
										) : (
											<motion.div
												key="game"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												transition={{ duration: 0.5 }}
											>
												<GameBoard
													playerHand={playerHand}
													dealerHand={dealerHand}
													gameState={gameState}
													calculateHandValue={calculateHandValue}
													streak={streak}
												/>
												<ControlPanel
													gameState={gameState}
													isDealing={isDealing}
													streak={streak}
													hit={hit}
													stand={stand}
													playAgain={playAgain}
													resetStreak={resetStreak}
												/>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
								<LeaderBoard streaks={streaks} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<Footer />
		</>
	)
}
