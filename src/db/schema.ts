import { integer, varchar, timestamp, pgSchema } from "drizzle-orm/pg-core";

export const schema = pgSchema("blackjack");

export const streaksTable = schema.table("streaks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    count: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});
