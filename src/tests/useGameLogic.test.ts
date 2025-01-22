import { describe, it, expect, vi } from 'vitest'
import { useGameLogic } from '@/hooks/useGameLogic'
import { renderHook } from '@testing-library/react'

vi.mock('@/hooks/useSoundEffects', () => ({
    useSoundEffects: () => ({
        playCardSound: vi.fn(),
        playMixingSound: vi.fn(),
    }),
}))

describe('calculateHandValue', () => {
    const mockPlayCardSound = vi.fn()
    const mockPlayMixingSound = vi.fn()
    const { result } = renderHook(() => useGameLogic(mockPlayCardSound, mockPlayMixingSound))

    it('should correctly calculate a hand without aces', () => {
        const hand = [
            { suit: 'Spade', value: '3', hidden: false },
            { suit: 'Heart', value: '2', hidden: false },
            { suit: 'Diamond', value: '7', hidden: false },
            { suit: 'Club', value: '4', hidden: false },
        ]
        const value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(16)
    })

    it('should correctly calculate a hand with one ace as 1', () => {
        const hand = [
            { suit: 'Spade', value: '3', hidden: false },
            { suit: 'Heart', value: 'A', hidden: false },
            { suit: 'Diamond', value: '2', hidden: false },
            { suit: 'Club', value: '7', hidden: false },
            { suit: 'Heart', value: '4', hidden: false },
        ]
        const value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(17)
    })

    it('should correctly calculate a hand with one ace as 11 if it does not bust', () => {
        const hand = [
            { suit: 'Spade', value: 'A', hidden: false },
            { suit: 'Heart', value: '2', hidden: false },
            { suit: 'Diamond', value: '3', hidden: false },
        ]
        const value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(16)
    })

    it('should correctly calculate a hand with multiple aces', () => {
        const hand = [
            { suit: 'Spade', value: 'A', hidden: false },
            { suit: 'Heart', value: 'A', hidden: false },
            { suit: 'Diamond', value: '9', hidden: false },
        ]
        const value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(21)
    })

    it('should correctly handle busts with multiple aces', () => {
        const hand = [
            { suit: 'Spade', value: 'A', hidden: false },
            { suit: 'Heart', value: 'A', hidden: false },
            { suit: 'Diamond', value: 'K', hidden: false },
        ]
        const value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(12)
    })

    it('should ignore hidden cards unless includeHidden is true', () => {
        const hand = [
            { suit: 'Spade', value: 'A', hidden: true },
            { suit: 'Heart', value: '5', hidden: false },
        ]
        let value = result.current.calculateHandValue(hand)
        expect(value.best).toBe(5)

        value = result.current.calculateHandValue(hand, true)
        expect(value.best).toBe(16)
    })
})
