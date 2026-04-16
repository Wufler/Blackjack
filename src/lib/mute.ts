import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'blackjack-muted'
const listeners = new Set<() => void>()
let muted = false

if (typeof window !== 'undefined') {
	muted = window.localStorage.getItem(STORAGE_KEY) === 'true'
}

function emit() {
	listeners.forEach(l => l())
}

export function getMuted() {
	return muted
}

export function setMuted(value: boolean) {
	muted = value
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(STORAGE_KEY, String(value))
	}
	emit()
}

export function toggleMuted() {
	setMuted(!muted)
}

function subscribe(listener: () => void) {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

export function useMuted() {
	return useSyncExternalStore(
		subscribe,
		() => muted,
		() => false
	)
}
