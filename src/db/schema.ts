import { integer, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

export const streaksTable = pgTable("streaks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    count: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});
