import { motion } from 'motion/react'
import { Trophy, Flame } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'

export function LeaderBoard({ streaks }: { streaks: Streak[] }) {
	if (!streaks.length) {
		return (
			<div className="bg-gray-800 rounded-xl p-4 shadow-lg w-full md:w-80 md:h-[620px] md:my-0 mb-12">
				<div className="flex flex-col h-full items-center justify-center">
					<Flame className="size-8 text-orange-500 mb-2" />
					<p className="text-lg">No streaks yet</p>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-gray-800 rounded-xl p-4 shadow-lg w-full md:w-80 md:h-[620px] md:my-0 mb-12">
			<motion.div initial={false} className="flex flex-col h-full">
				<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
					<Flame className="size-6 text-orange-500" />
					Top 10 Streaks
				</h2>
				<ScrollArea className="h-full">
					<div className="space-y-4">
						{streaks.map((streak, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className={`bg-gray-700 rounded-lg p-3 flex items-center relative overflow-hidden ${
									index === 0 ? 'bg-gradient-to-r to-yellow-500 from-yellow-600' : ''
								} ${
									index === 1 ? 'bg-gradient-to-r to-slate-400 from-slate-500' : ''
								} ${index === 2 ? 'bg-gradient-to-r to-amber-700 from-amber-800' : ''}`}
							>
								<span className="absolute inset-y-0 right-0 text-8xl font-black tracking-tight opacity-40 flex items-center pr-2">
									{index < 1 ? (
										<div className="absolute inset-y-0 right-2 flex items-center">
											<Trophy className="size-8 self-end mt-1 mr-2" />
											<p>{streak.count}</p>
										</div>
									) : (
										<div className="absolute inset-y-0 right-2 flex items-center">
											<p className="font-extralight text-4xl self-end -mb-1 mr-2">
												{index + 1}
											</p>
											<p>{streak.count}</p>
										</div>
									)}
								</span>
								<div className="flex items-center gap-3 relative">
									<div className="mr-16">
										<p className="font-semibold truncate max-w-52 md:max-w-44">
											{streak.name}
										</p>
										<p className="text-sm opacity-75">
											{formatDistanceToNowStrict(streak.createdAt, { addSuffix: true })}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</ScrollArea>
			</motion.div>
		</div>
	)
}
