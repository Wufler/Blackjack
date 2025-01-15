import Game from '@/components/BlackjackGame'
import { getTopStreaks } from './actions'
import { connection } from 'next/server'

export default async function Home() {
	await connection()
	const streaks = await getTopStreaks()
	return <Game streaks={streaks} />
}
