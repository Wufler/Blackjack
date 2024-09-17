'use server'

import { sql } from '@vercel/postgres'

export async function saveStreak(streak: number, name: string) {
    await sql`INSERT INTO streaks (count, name) VALUES (${streak}, ${name})`
}

export async function getTopStreaks() {
    const { rows } = await sql`SELECT name, count, created_at FROM streaks ORDER BY count DESC LIMIT 5`
    return rows.map(row => ({ name: row.name, count: row.count, created_at: row.created_at }))
}