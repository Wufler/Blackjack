import Game from '@/components/BlackjackGame'
import { getTopStreaks } from './actions'

export default async function Page() {
	const streaks = await getTopStreaks()
	return <Game streaks={streaks} />
}
