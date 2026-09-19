import { IconFlame, IconTrophy } from "@tabler/icons-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { motion } from "motion/react";
import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default memo(function LeaderBoard({
  streaks,
  dbConnected,
}: {
  streaks: Streak[];
  dbConnected: boolean;
}) {
  if (!dbConnected) {
    return (
      <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg md:w-80 md:h-full md:min-h-0 md:self-stretch">
        <div className="flex flex-col h-full items-center justify-center text-center">
          <IconFlame className="size-8 text-orange-500 mb-2" />
          <p className="text-lg font-semibold">Database not connected</p>
        </div>
      </div>
    );
  }

  if (!streaks.length) {
    return (
      <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg md:w-80 md:h-full md:min-h-0 md:self-stretch">
        <div className="flex flex-col h-full items-center justify-center">
          <IconFlame className="size-8 text-orange-500 mb-2" />
          <p className="text-lg">No streaks yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg md:w-80 md:h-full md:min-h-0 md:self-stretch md:bg-gray-800 md:p-4 md:shadow-lg">
      <motion.div initial={false} className="flex h-full min-h-0 flex-col">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <IconFlame className="size-6 text-orange-500" />
          Top 10 Streaks
        </h2>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4">
            {streaks.map((streak, index) => {
              const date = new Date(streak.createdAt);

              return (
                <motion.div
                  key={`${streak.name}-${streak.createdAt.toISOString()}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`bg-gray-700 rounded-lg p-3 flex items-center relative overflow-hidden ${
                    index === 0
                      ? "bg-linear-to-r to-yellow-500 from-yellow-600"
                      : ""
                  } ${index === 1 ? "bg-linear-to-r to-slate-400 from-slate-500" : ""} ${
                    index === 2
                      ? "bg-linear-to-r to-amber-700 from-amber-800"
                      : ""
                  }`}
                >
                  <span className="absolute inset-y-0 right-0 text-8xl font-black tracking-tight flex items-center pr-2">
                    {index < 1 ? (
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <IconTrophy className="size-8 self-end mt-1 mr-2 opacity-50" />
                        <p className="opacity-70">{streak.count}</p>
                      </div>
                    ) : (
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <p className="font-extralight text-4xl self-end -mb-1 mr-2 opacity-50">
                          {index + 1}
                        </p>
                        <p className="opacity-70">{streak.count}</p>
                      </div>
                    )}
                  </span>
                  <div className="flex items-center gap-3 relative">
                    <div className="mr-16">
                      <p className="font-semibold truncate max-w-52 md:max-w-44">
                        {streak.name}
                      </p>
                      <p
                        className="text-sm opacity-75 cursor-default hover:opacity-100 transition-opacity"
                        title={format(date, "PPP 'at' pp")}
                        suppressHydrationWarning
                      >
                        {formatDistanceToNowStrict(date, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
});
