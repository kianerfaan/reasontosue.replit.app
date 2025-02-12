import { db } from "./db";
import { tariffQueries, queryFeedback, type TariffQuery, type InsertTariffQuery, type InsertQueryFeedback } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getTariffQueries(): Promise<TariffQuery[]>;
  createTariffQuery(query: InsertTariffQuery): Promise<TariffQuery>;
  getRecentQueries(limit: number): Promise<TariffQuery[]>;
  addQueryFeedback(feedback: InsertQueryFeedback): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTariffQueries(): Promise<TariffQuery[]> {
    return await db.select().from(tariffQueries).orderBy(tariffQueries.queryDate);
  }

  async createTariffQuery(insertQuery: InsertTariffQuery): Promise<TariffQuery> {
    const [query] = await db
      .insert(tariffQueries)
      .values(insertQuery)
      .returning();
    return query;
  }

  async getRecentQueries(limit: number): Promise<TariffQuery[]> {
    return await db
      .select()
      .from(tariffQueries)
      .orderBy(desc(tariffQueries.queryDate))
      .limit(limit);
  }

  async addQueryFeedback(feedback: InsertQueryFeedback): Promise<void> {
    await db.insert(queryFeedback).values(feedback);
  }
}

export const storage = new DatabaseStorage();