import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { saveStreak } from '@/app/actions'
import { toast } from 'sonner'
import { motion } from 'motion/react'

export function SubmitStreak({
	streak,
	onSubmit,
}: {
	streak: number
	onSubmit: () => void
}) {
	const [playerName, setPlayerName] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		startTransition(async () => {
			if (streak > 0 && playerName) {
				await saveStreak(streak, playerName)
				toast.success('Your score has been submitted!')
				onSubmit()
			}
		})
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<motion.div>
					<Button className="w-full bg-purple-500 text-white border-none py-6 px-8 rounded-lg text-lg hover:bg-purple-600">
						Submit Streak
					</Button>
				</motion.div>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 p-4 rounded-xl shadow-xl"
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name" className="text-blue-300">
							Name
						</Label>
						<Input
							id="name"
							type="text"
							placeholder="Joe"
							value={playerName}
							maxLength={25}
							required
							onChange={e => setPlayerName(e.target.value)}
							className="bg-gray-700 mt-1 text-white border-gray-600 focus:border-blue-500"
						/>
					</div>
					<Button
						type="submit"
						disabled={isPending}
						className="w-full bg-blue-500 text-white hover:bg-blue-600"
					>
						Submit {streak} {streak > 1 ? 'wins' : 'win'}
					</Button>
				</form>
			</PopoverContent>
		</Popover>
	)
}
