'use server'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { desc } from 'drizzle-orm';
import { streaksTable } from './db/schema';
import { checkBotId } from 'botid/server';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export async function saveStreak(streak: number, name: string) {
    const verification = await checkBotId()
    if (verification.isBot) throw new Error('Failed to submit streak')

    await db.insert(streaksTable).values({
        count: streak,
        name: name
    });

    revalidatePath('/')

    return { success: true, user: name };
}

export async function getTopStreaks() {
    return await db.select({
        name: streaksTable.name,
        count: streaksTable.count,
        createdAt: streaksTable.createdAt
    })
        .from(streaksTable)
        .orderBy(desc(streaksTable.count))
        .limit(10);
}
