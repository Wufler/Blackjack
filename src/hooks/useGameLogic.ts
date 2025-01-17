import { useState, useCallback, useRef, useEffect } from 'react'

export function useGameLogic(playCardSound: () => void, playMixingSound: () => void) {
    const [playerHand, setPlayerHand] = useState<PlayingCard[]>([])
    const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
    const [deck, setDeck] = useState<PlayingCard[]>([])
    const [gameState, setGameState] = useState<GameResult>(null)
    const [streak, setStreak] = useState(0)
    const [isDealing, setIsDealing] = useState(false)
    const [previousStreak, setPreviousStreak] = useState(0);

    const endGameRef = useRef<(result: GameResult) => void>(null)

    const handleGameLoss = useCallback(() => {
        setPreviousStreak(streak);
        setStreak(0);
    }, [streak]);

    const endGame = useCallback((result: GameResult) => {
        setGameState(result)
        if (result === 'win') {
            setStreak(prevStreak => prevStreak + 1)
        } else if (result === 'lose') {
            handleGameLoss()
        }
    }, [handleGameLoss])

    useEffect(() => {
        endGameRef.current = endGame
    }, [endGame])

    const initializeDeck = useCallback(() => {
        const suits = ['Spade', 'Heart', 'Diamond', 'Club']
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        const newDeck = suits.flatMap(suit => values.map(value => ({ suit, value, hidden: false })))
        return shuffleDeck(newDeck)
    }, [])

    const shuffleDeck = (deck: PlayingCard[]) => {
        return [...deck].sort(() => Math.random() - 0.5)
    }

    const drawCard = useCallback(
        (currentDeck: PlayingCard[], hidden: boolean = false): [PlayingCard, PlayingCard[]] => {
            const [drawnCard, ...remainingDeck] = currentDeck
            playCardSound()
            return [{ ...drawnCard, hidden }, remainingDeck]
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
            setHand: React.Dispatch<React.SetStateAction<PlayingCard[]>>,
            hidden: boolean = false
        ) => {
            const [card, updatedDeck] = drawCard(newDeck, hidden)
            newDeck = updatedDeck
            setHand(prevHand => [...prevHand, card])
            await new Promise(resolve => setTimeout(resolve, 500))
            return card
        }

        newPlayerHand.push(await dealCard(setPlayerHand))
        newDealerHand.push(await dealCard(setDealerHand))
        newPlayerHand.push(await dealCard(setPlayerHand))
        const lastDealerCard = await dealCard(setDealerHand, true)
        newDealerHand.push({ ...lastDealerCard, hidden: false })

        setDeck(newDeck)
        setIsDealing(false)

        const playerValue = calculateHandValue(newPlayerHand)
        const dealerValue = calculateHandValue(newDealerHand)

        if (playerValue === 21) {
            endGameRef.current?.('win')
        } else if (dealerValue === 21) {
            endGameRef.current?.('lose')
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
                endGameRef.current?.('lose')
            } else if (newHandValue === 21) {
                endGameRef.current?.('win')
            }
        }
    }

    const stand = async () => {
        if (gameState !== null || isDealing) return

        setIsDealing(true)
        const revealedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }))
        setDealerHand(revealedDealerHand)
        playCardSound()

        await new Promise(resolve => setTimeout(resolve, 500))

        let currentDealerHand = revealedDealerHand
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
            endGameRef.current?.('win')
        } else if (playerValue < dealerValue) {
            endGameRef.current?.('lose')
        } else {
            endGameRef.current?.('tie')
        }
    }

    const calculateHandValue = (hand: PlayingCard[]) => {
        let value = 0
        let aces = 0
        for (const card of hand) {
            if (card.hidden) continue
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
        previousStreak,
    }
}

