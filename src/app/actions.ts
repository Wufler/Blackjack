'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'

export async function saveStreak(streak: number, name: string) {
    await prisma.streaks.create({
        data: {
            count: streak,
            name: name
        }
    })
    revalidatePath("/")
}

export async function getTopStreaks() {
    return await prisma.streaks.findMany({
        select: {
            name: true,
            count: true,
            createdAt: true
        },
        orderBy: {
            count: 'desc'
        },
        take: 10
    })
}