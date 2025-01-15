import { useRef, useEffect, useCallback } from 'react'

export function useSoundEffects() {
    const cardAudioRef = useRef<HTMLAudioElement | null>(null)
    const mixingAudioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        cardAudioRef.current = new Audio('/card.mp3')
        mixingAudioRef.current = new Audio('/mixing.mp3')
    }, [])

    const playCardSound = useCallback(() => {
        if (cardAudioRef.current) {
            cardAudioRef.current.currentTime = 0
            cardAudioRef.current.play()
        }
    }, [])

    const playMixingSound = useCallback(() => {
        if (mixingAudioRef.current) {
            mixingAudioRef.current.currentTime = 0
            mixingAudioRef.current.play()
        }
    }, [])

    return { playCardSound, playMixingSound }
}

