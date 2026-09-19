import { IconHandStop, IconPlayerPlay, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SubmitStreak } from "./SubmitStreak";

export function ControlPanel({
  gameState,
  isDealing,
  streak,
  hit,
  stand,
  playAgain,
  resetStreak,
  dbConnected,
}: ControlPanelProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      if (gameState === null && !isDealing) {
        if (e.key === "q") hit();
        if (e.key === "w" || e.key === " ") stand();
      } else if (gameState !== null && !isDealing) {
        if (e.key === "e" || e.key === " ") playAgain();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, isDealing, hit, stand, playAgain]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
    >
      <div className="flex min-w-0 w-full gap-4">
        {gameState === null ? (
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row w-full">
            <Button
              onClick={hit}
              disabled={gameState !== null || isDealing}
              className="min-w-0 w-full bg-emerald-600 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-102 hover:bg-emerald-700 disabled:opacity-50"
            >
              <IconPlus className="size-6" />
              Hit
            </Button>
            <Button
              onClick={stand}
              disabled={gameState !== null || isDealing}
              className="min-w-0 w-full bg-rose-600 text-white border-none py-6 px-8 rounded-lg text-lg transform transition-all hover:scale-102 hover:bg-rose-700 disabled:opacity-50"
            >
              <IconHandStop className="size-6" />
              Stand
            </Button>
          </div>
        ) : (
          <div
            className={`grid min-w-0 w-full grid-cols-1 gap-4 ${
              streak > 0 && dbConnected ? "sm:grid-cols-2" : ""
            }`}
          >
            <Button
              onClick={playAgain}
              disabled={isDealing}
              className="w-full bg-blue-600 text-white border-none py-6 px-8 rounded-lg text-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <IconPlayerPlay className="size-6" />
              Play Again
            </Button>
            {streak > 0 && dbConnected && (
              <SubmitStreak
                streak={streak}
                onSubmit={resetStreak}
                isDealing={isDealing}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
