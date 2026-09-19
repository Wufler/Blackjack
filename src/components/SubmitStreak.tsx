import { IconTrophy } from "@tabler/icons-react";
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { saveStreak } from "@/index";

export function SubmitStreak({
  streak,
  isDealing,
  onSubmit,
}: {
  streak: number;
  isDealing: boolean;
  onSubmit: () => void;
}) {
  const [playerName, setPlayerName] = useState("");
  const [isPending, startTransition] = useTransition();

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      if (streak > 0 && playerName) {
        const matches = matcher.getAllMatches(playerName);
        if (matches.length > 0) {
          toast.error("Please use another name.");
          return;
        }
        await saveStreak(streak, playerName);
        toast.success(`Your streak of ${streak} has been submitted!`);
        onSubmit();
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={<Button />}
        disabled={isDealing}
        className="w-full sm:min-w-0 sm:flex-1 sm:shrink bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none py-6 px-8 rounded-lg text-lg transition-all duration-200"
      >
        <IconTrophy className="size-6" />
        Submit Streak
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-full bg-linear-to-b from-gray-800 to-gray-900 border-gray-700 p-4 rounded-xl shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={playerName}
              maxLength={25}
              required
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-700 mt-1 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || isDealing}
            className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-200"
          >
            Publish {streak} Win{streak > 1 ? "s" : ""}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
