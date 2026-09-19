"use server";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { checkBotId } from "botid/server";
import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { revalidatePath } from "next/cache";
import { Pool } from "pg";
import { streaksTable } from "./db/schema";

const databaseUrl = process.env.DATABASE_URL;

const isLocalPostgres = databaseUrl
  ? ["localhost", "127.0.0.1", "postgres"].includes(
      new URL(databaseUrl).hostname,
    )
  : false;

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

const postgresPool =
  databaseUrl && isLocalPostgres
    ? (globalForPostgres.postgresPool ??
      new Pool({ connectionString: databaseUrl }))
    : null;

if (postgresPool && process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresPool = postgresPool;
}

const db = databaseUrl
  ? isLocalPostgres && postgresPool
    ? drizzlePostgres(postgresPool)
    : drizzle({ client: neon(databaseUrl) })
  : null;

export async function saveStreak(streak: number, name: string) {
  if (!db) throw new Error("Leaderboard is unavailable");

  const verification = await checkBotId();
  if (verification.isBot) throw new Error("Failed to submit streak");

  await db.insert(streaksTable).values({
    count: streak,
    name: name,
  });

  revalidatePath("/");

  return { success: true, user: name };
}

export async function getTopStreaks() {
  if (!db) throw new Error("Leaderboard is unavailable");

  return await db
    .select({
      name: streaksTable.name,
      count: streaksTable.count,
      createdAt: streaksTable.createdAt,
    })
    .from(streaksTable)
    .orderBy(desc(streaksTable.count))
    .limit(10);
}
