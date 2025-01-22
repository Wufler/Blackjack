type PlayingCard = {
    suit: string
    value: string
    hidden: boolean
}

type HandValue = {
    hard: number
    soft: number
    best: number
}

type PlayingCardProps = {
    card: PlayingCard
    result: GameResult
    isPlayer: boolean
    index: number
    isDealing: boolean
}

type GameBoardProps = {
    playerHand: PlayingCard[]
    dealerHand: PlayingCard[]
    gameState: GameResult
    calculateHandValue: (hand: PlayingCard[], includeHidden?: boolean) => HandValue
    streak: number
    previousStreak: number
    isDealing: boolean
}

type Streak = {
    name: string
    count: number
    createdAt: Date
}

type ControlPanelProps = {
    gameState: GameResult
    isDealing: boolean
    streak: number
    hit: () => void
    stand: () => void
    playAgain: () => void
    resetStreak: () => void
}

type HandDisplayProps = {
    title: string
    hand: PlayingCard[]
    gameState: GameResult
    isPlayer: boolean
    streak: number
    calculateHandValue: (hand: PlayingCard[], includeHidden?: boolean) => HandValue
    previousStreak: number
    isDealing: boolean
}

type GameResult = 'win' | 'lose' | 'tie' | null
