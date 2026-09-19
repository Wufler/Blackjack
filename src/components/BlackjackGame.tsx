"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { ControlPanel } from "./ControlPanel";
import Footer from "./Footer";
import { GameBoard } from "./GameBoard";
import LeaderBoard from "./LeaderBoard";
import { Button } from "./ui/button";

export default function BlackjackGame({
  streaks,
  dbConnected,
}: {
  streaks: Streak[];
  dbConnected: boolean;
}) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { playCardSound, playMixingSound } = useSoundEffects();
  const {
    playerHand,
    dealerHand,
    gameState,
    streak,
    previousStreak,
    isDealing,
    hit,
    stand,
    startGame,
    playAgain,
    calculateHandValue,
    resetStreak,
  } = useGameLogic(playCardSound, playMixingSound);

  useEffect(() => {
    if (isGameStarted) {
      startGame();
    }
  }, [isGameStarted, startGame]);

  return (
    <div className="min-h-dvh bg-linear-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <div className="flex min-h-0 flex-1 justify-center md:items-center md:p-8">
        <Card className="w-full max-w-4xl overflow-hidden rounded-none bg-linear-to-br from-gray-800 to-gray-900 shadow-2xl md:h-[calc(100dvh-8rem)] md:min-h-137.5 md:max-h-172.5 md:rounded-lg md:border-blue-500">
          <CardContent className="p-4 md:h-full md:p-8">
            <div className="md:h-full md:min-h-0">
              <div className="md:hidden w-full">
                <Tabs defaultValue="game" className="gap-4">
                  <TabsList
                    variant="line"
                    className="rounded-none border-b p-0"
                  >
                    <TabsTrigger
                      value="game"
                      className="border-0 group-data-horizontal/tabs:after:bottom-[-0.5px]"
                    >
                      Game
                    </TabsTrigger>
                    <TabsTrigger
                      value="streaks"
                      className="border-0 group-data-horizontal/tabs:after:bottom-[-0.5px]"
                    >
                      Streaks
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="game" className="min-w-0 w-full">
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
                          transition={{ duration: 0.3 }}
                        >
                          <GameBoard
                            playerHand={playerHand}
                            dealerHand={dealerHand}
                            gameState={gameState}
                            calculateHandValue={calculateHandValue}
                            streak={streak}
                            previousStreak={previousStreak}
                            isDealing={isDealing}
                          />
                          <ControlPanel
                            gameState={gameState}
                            isDealing={isDealing}
                            streak={streak}
                            hit={hit}
                            stand={stand}
                            playAgain={playAgain}
                            resetStreak={resetStreak}
                            dbConnected={dbConnected}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                  <TabsContent value="streaks" className="min-w-0 w-full">
                    <LeaderBoard streaks={streaks} dbConnected={dbConnected} />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="hidden w-full md:grid md:h-full md:min-h-0 md:grid-cols-[minmax(0,1fr)_20rem] md:grid-rows-[minmax(0,1fr)] md:items-stretch md:gap-6">
                <div className="min-w-0 min-h-0 md:h-full">
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
                        className="flex h-full flex-col justify-between"
                      >
                        <GameBoard
                          playerHand={playerHand}
                          dealerHand={dealerHand}
                          gameState={gameState}
                          calculateHandValue={calculateHandValue}
                          streak={streak}
                          previousStreak={previousStreak}
                          isDealing={isDealing}
                        />
                        <ControlPanel
                          gameState={gameState}
                          isDealing={isDealing}
                          streak={streak}
                          hit={hit}
                          stand={stand}
                          playAgain={playAgain}
                          resetStreak={resetStreak}
                          dbConnected={dbConnected}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <LeaderBoard streaks={streaks} dbConnected={dbConnected} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
