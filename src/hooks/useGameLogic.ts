import { useState, useCallback } from 'react'

export function useGameLogic(playCardSound: () => void, playMixingSound: () => void) {
    const [playerHand, setPlayerHand] = useState<PlayingCard[]>([])
    const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
    const [deck, setDeck] = useState<PlayingCard[]>([])
    const [gameState, setGameState] = useState<GameResult>(null)
    const [streak, setStreak] = useState(0)
    const [isDealing, setIsDealing] = useState(false)

    const initializeDeck = useCallback(() => {
        const suits = ['Spade', 'Heart', 'Diamond', 'Club']
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        const newDeck = suits.flatMap(suit => values.map(value => ({ suit, value })))
        return shuffleDeck(newDeck)
    }, [])

    const shuffleDeck = (deck: PlayingCard[]) => {
        return [...deck].sort(() => Math.random() - 0.5)
    }

    const drawCard = useCallback(
        (currentDeck: PlayingCard[]): [PlayingCard, PlayingCard[]] => {
            const [drawnCard, ...remainingDeck] = currentDeck
            playCardSound()
            return [drawnCard, remainingDeck]
        },
        [playCardSound]
    )

    const startGame = useCallback(async () => {
        setIsDealing(true)
        playMixingSound()
        const newPlayerHand: PlayingCard[] = []
        const newDealerHand: PlayingCard[] = []
        let newDeck = initializeDeck()

        const dealCard = async (
            setHand: React.Dispatch<React.SetStateAction<PlayingCard[]>>
        ) => {
            const [card, updatedDeck] = drawCard(newDeck)
            newDeck = updatedDeck
            setHand(prevHand => [...prevHand, card])
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        await dealCard(setPlayerHand)
        await dealCard(setDealerHand)
        await dealCard(setPlayerHand)

        setDeck(newDeck)
        setIsDealing(false)

        const playerValue = calculateHandValue(newPlayerHand)
        const dealerValue = calculateHandValue(newDealerHand)

        if (playerValue === 21) {
            endGame('win')
        } else if (dealerValue === 21) {
            endGame('lose')
        } else {
            setGameState(null)
        }
    }, [initializeDeck, drawCard, playMixingSound])

    const hit = async () => {
        if (deck.length > 0 && gameState === null && !isDealing) {
            setIsDealing(true)
            const [newCard, newDeck] = drawCard(deck)
            const newHand = [...playerHand, newCard]
            setPlayerHand(newHand)
            setDeck(newDeck)
            await new Promise(resolve => setTimeout(resolve, 500))
            setIsDealing(false)
            const newHandValue = calculateHandValue(newHand)
            if (newHandValue > 21) {
                endGame('lose')
            } else if (newHandValue === 21) {
                endGame('win')
            }
        }
    }

    const stand = async () => {
        if (gameState !== null || isDealing) return

        setIsDealing(true)
        let currentDealerHand = [...dealerHand]
        let currentDeck = [...deck]
        while (calculateHandValue(currentDealerHand) < 17 && currentDeck.length > 0) {
            const [newCard, newDeck] = drawCard(currentDeck)
            currentDealerHand = [...currentDealerHand, newCard]
            currentDeck = newDeck
            setDealerHand(currentDealerHand)
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        setDeck(currentDeck)
        setIsDealing(false)
        const playerValue = calculateHandValue(playerHand)
        const dealerValue = calculateHandValue(currentDealerHand)
        if (dealerValue > 21 || playerValue > dealerValue) {
            endGame('win')
        } else if (playerValue < dealerValue) {
            endGame('lose')
        } else {
            endGame('tie')
        }
    }

    const calculateHandValue = (hand: PlayingCard[]) => {
        let value = 0
        let aces = 0
        for (const card of hand) {
            if (card.value === 'A') {
                aces += 1
                value += 11
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                value += 10
            } else {
                value += parseInt(card.value)
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10
            aces -= 1
        }
        return value
    }

    const endGame = (result: GameResult) => {
        setGameState(result)
        if (result === 'win') {
            setStreak(prevStreak => prevStreak + 1)
        } else if (result === 'lose') {
            setStreak(0)
        }
    }

    const playAgain = () => {
        setPlayerHand([])
        setDealerHand([])
        setDeck([])
        setGameState(null)
        startGame()
    }

    const resetStreak = useCallback(() => {
        setStreak(0)
    }, [])

    return {
        playerHand,
        dealerHand,
        gameState,
        streak,
        isDealing,
        hit,
        stand,
        startGame,
        playAgain,
        calculateHandValue,
        resetStreak,
    }
}

