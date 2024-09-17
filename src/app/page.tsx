import Game from '@/components/Blackjack'
import { getTopStreaks } from './actions'
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
	noStore()
	const streaks = await getTopStreaks()
	return <Game streaks={streaks} />
}
