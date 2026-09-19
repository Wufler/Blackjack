export const dynamic = "force-dynamic";

import Game from "@/components/BlackjackGame";
import { getTopStreaks } from "@/index";

export default async function Home() {
  let streaks: Streak[] = [];
  let dbConnected = true;

  try {
    streaks = await getTopStreaks();
  } catch {
    dbConnected = false;
  }

  return <Game streaks={streaks} dbConnected={dbConnected} />;
}
