export const dynamic = 'force-dynamic'
import Game from '@/components/BlackjackGame'
import { getTopStreaks } from '@/index'

export default async function Home() {
	const streaks = await getTopStreaks()
	return <Game streaks={streaks} />
}
