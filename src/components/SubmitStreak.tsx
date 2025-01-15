import { useState, useTransition } from 'react'
import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { saveStreak } from '@/app/actions'
import { toast } from 'sonner'

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
				toast.success(`Your streak of ${streak} has been submitted!`)
				onSubmit()
			}
		})
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none py-6 px-8 rounded-lg text-lg transition-all duration-200">
					<Trophy className="size-6" />
					Submit Streak
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="max-w-56 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 p-4 rounded-xl shadow-xl"
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Input
							id="name"
							type="text"
							placeholder="Insert your name..."
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
						className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white transition-all duration-200"
					>
						{isPending
							? 'Publishing...'
							: `Publish ${streak} Win${streak > 1 ? 's' : ''}`}
					</Button>
				</form>
			</PopoverContent>
		</Popover>
	)
}
