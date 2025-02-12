import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tariffQueries = pgTable("tariff_queries", {
  id: serial("id").primaryKey(),
  importerCountry: text("importer_country").notNull(),  
  exporterCountry: text("exporter_country").notNull(),
  productDescription: text("product_description").notNull(),
  tariffRate: text("tariff_rate").notNull(),
  queryDate: timestamp("query_date").notNull().defaultNow(),
  informationDate: text("information_date").notNull(),
});

// Feedback table
export const queryFeedback = pgTable("query_feedback", {
  id: serial("id").primaryKey(),
  queryId: integer("query_id").notNull(),
  isPositive: boolean("is_positive").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema for inserting into database - includes tariffRate
export const insertTariffQuerySchema = createInsertSchema(tariffQueries).omit({
  id: true,
  queryDate: true,
});

export type InsertTariffQuery = z.infer<typeof insertTariffQuerySchema>;
export type TariffQuery = typeof tariffQueries.$inferSelect;

// Form validation schema - excludes tariffRate as it's determined by the API
export const tariffFormSchema = insertTariffQuerySchema.omit({
  tariffRate: true,
  informationDate: true,
});

export type TariffFormData = z.infer<typeof tariffFormSchema>;

// Feedback schema
export const insertFeedbackSchema = createInsertSchema(queryFeedback).omit({
  id: true,
  createdAt: true,
});

export type InsertQueryFeedback = z.infer<typeof insertFeedbackSchema>;
export type QueryFeedback = typeof queryFeedback.$inferSelect;