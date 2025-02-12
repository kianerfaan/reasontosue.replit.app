import { pgTable, text, serial, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalCases = pgTable("legal_cases", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  description: text("description").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  analysis: text("analysis"),
  incidentDate: date("incident_date"),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    username: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  });

export const insertLegalCaseSchema = createInsertSchema(legalCases)
  .omit({ id: true, analysis: true, createdAt: true })
  .extend({
    description: z.string().min(10).max(2000),
    jurisdiction: z.string().min(2).max(100),
    incidentDate: z.string().optional(),
    response: z.string().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCases.$inferSelect;