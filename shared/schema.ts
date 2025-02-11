import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const legalCases = pgTable("legal_cases", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  analysis: text("analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLegalCaseSchema = createInsertSchema(legalCases)
  .omit({ id: true, analysis: true, createdAt: true })
  .extend({
    description: z.string().min(10).max(2000),
    jurisdiction: z.string().min(2).max(100),
  });

export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCases.$inferSelect;