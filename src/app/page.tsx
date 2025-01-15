import Game from '@/components/BlackjackGame'
import { getTopStreaks } from './actions'
import Footer from '@/components/Footer'

export default async function Page() {
	const streaks = await getTopStreaks()
	return <Game streaks={streaks} />
}
