import { useState, useCallback, useRef, useEffect } from 'react'

export function useGameLogic(playCardSound: () => void, playMixingSound: () => void) {
    const [playerHand, setPlayerHand] = useState<PlayingCard[]>([])
    const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
    const [deck, setDeck] = useState<PlayingCard[]>([])
    const [gameState, setGameState] = useState<GameResult>(null)
    const [streak, setStreak] = useState(0)
    const [isDealing, setIsDealing] = useState(false)
    const [previousStreak, setPreviousStreak] = useState(0)

    const endGameRef = useRef<(result: GameResult) => void>(null)
    const currentDeckRef = useRef<PlayingCard[]>([])

    const handleGameLoss = useCallback(() => {
        setPreviousStreak(streak)
        setStreak(0)
    }, [streak])

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

    const calculateHandValue = useCallback((hand: PlayingCard[], includeHidden: boolean = false): HandValue => {
        let baseValue = 0;
        let numAces = 0;

        for (const card of hand) {
            if (card.hidden && !includeHidden) continue;
            if (card.value === 'A') {
                numAces++;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                baseValue += 10;
            } else {
                baseValue += parseInt(card.value, 10);
            }
        }

        if (numAces === 0) {
            return {
                hard: baseValue,
                soft: baseValue,
                best: baseValue,
            };
        }

        const hardTotal = baseValue + numAces;

        let softTotal = hardTotal;
        if (hardTotal + 10 <= 21) {
            softTotal += 10;
        }

        return {
            hard: hardTotal,
            soft: softTotal,
            best: softTotal <= 21 ? softTotal : hardTotal,
        };
    }, []);

    const checkInitialBlackjack = useCallback((pHand: PlayingCard[], dHand: PlayingCard[]) => {
        const playerValue = calculateHandValue(pHand).best
        const dealerValue = calculateHandValue(dHand, true).best

        if (playerValue === 21 && dealerValue === 21) {
            setDealerHand(dHand.map(card => ({ ...card, hidden: false })))
            return 'tie'
        } else if (playerValue === 21) {
            setDealerHand(dHand.map(card => ({ ...card, hidden: false })))
            return 'win'
        } else if (dealerValue === 21) {
            setDealerHand(dHand.map(card => ({ ...card, hidden: false })))
            return 'lose'
        }
        return null
    }, [calculateHandValue])

    const startGame = useCallback(async () => {
        setIsDealing(true)
        playMixingSound()

        setPlayerHand([])
        setDealerHand([])

        const newDeck = initializeDeck()
        currentDeckRef.current = newDeck

        let currentPlayerHand: PlayingCard[] = []
        let currentDealerHand: PlayingCard[] = []

        const dealCard = async (
            setHand: React.Dispatch<React.SetStateAction<PlayingCard[]>>,
            currentHand: PlayingCard[],
            hidden: boolean = false
        ): Promise<PlayingCard[]> => {
            const [card, updatedDeck] = drawCard(currentDeckRef.current, hidden)
            currentDeckRef.current = updatedDeck
            const newHand = [...currentHand, card]
            setHand(newHand)
            await new Promise(resolve => setTimeout(resolve, 500))
            return newHand
        }

        currentPlayerHand = await dealCard(setPlayerHand, currentPlayerHand)
        currentDealerHand = await dealCard(setDealerHand, currentDealerHand)
        currentPlayerHand = await dealCard(setPlayerHand, currentPlayerHand)
        currentDealerHand = await dealCard(setDealerHand, currentDealerHand, true)

        setDeck(currentDeckRef.current)
        setIsDealing(false)

        const result = checkInitialBlackjack(currentPlayerHand, currentDealerHand)

        if (result) {
            endGameRef.current?.(result)
        } else {
            setGameState(null)
        }
    }, [initializeDeck, drawCard, playMixingSound, checkInitialBlackjack])

    const hit = useCallback(async () => {
        if (deck.length > 0 && gameState === null && !isDealing) {
            setIsDealing(true)
            const [newCard, newDeck] = drawCard(deck)
            const newHand = [...playerHand, newCard]
            setPlayerHand(newHand)
            setDeck(newDeck)
            await new Promise(resolve => setTimeout(resolve, 500))
            setIsDealing(false)

            const newHandValue = calculateHandValue(newHand).best
            if (newHandValue > 21) {
                setDealerHand(prev => prev.map(card => ({ ...card, hidden: false })))
                endGameRef.current?.('lose')
            } else if (newHandValue === 21) {
                setDealerHand(prev => prev.map(card => ({ ...card, hidden: false })))
                endGameRef.current?.('win')
            }
        }
    }, [deck, gameState, isDealing, playerHand, drawCard, calculateHandValue])

    const stand = useCallback(async () => {
        if (gameState !== null || isDealing) return

        setIsDealing(true)

        const revealedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }))
        setDealerHand(revealedDealerHand)
        playCardSound()
        await new Promise(resolve => setTimeout(resolve, 500))

        let currentDealerHand = revealedDealerHand
        let currentDeck = [...deck]

        while (currentDeck.length > 0) {
            const dealerValue = calculateHandValue(currentDealerHand).best
            if (dealerValue >= 17) break;

            const [newCard, newDeck] = drawCard(currentDeck)
            currentDealerHand = [...currentDealerHand, newCard]
            currentDeck = newDeck
            setDealerHand(currentDealerHand)
            setDeck(currentDeck)
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        setIsDealing(false)

        const playerValue = calculateHandValue(playerHand).best
        const dealerValue = calculateHandValue(currentDealerHand).best

        if (dealerValue > 21) {
            endGameRef.current?.('win')
        } else if (playerValue > dealerValue) {
            endGameRef.current?.('win')
        } else if (playerValue < dealerValue) {
            endGameRef.current?.('lose')
        } else {
            endGameRef.current?.('tie')
        }
    }, [gameState, isDealing, dealerHand, deck, playerHand, playCardSound, drawCard, calculateHandValue])

    const playAgain = useCallback(() => {
        startGame()
    }, [startGame])

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

