type PlayingCard = {
    suit: string
    value: string
}

type PlayingCardProps = {
    card: PlayingCard
    result: GameResult
    isPlayer: boolean
    index: number
}

type GameBoardProps = {
    playerHand: PlayingCard[]
    dealerHand: PlayingCard[]
    gameState: GameResult
    calculateHandValue: (hand: PlayingCard[]) => number
    streak: number
}

type Streak = {
    name: string
    count: number
    created_at: Date
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
    calculateHandValue: (hand: PlayingCard[]) => number
}

type GameResult = 'win' | 'lose' | 'tie' | null
