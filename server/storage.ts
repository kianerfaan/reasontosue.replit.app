import { users, legalCases, type User, type InsertUser, type LegalCase, type InsertLegalCase } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLegalCase(id: number): Promise<LegalCase | undefined>;
  createLegalCase(legalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw new Error("Failed to fetch user by username");
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async getLegalCase(id: number): Promise<LegalCase | undefined> {
    try {
      const [legalCase] = await db.select().from(legalCases).where(eq(legalCases.id, id));
      return legalCase;
    } catch (error) {
      console.error("Error fetching legal case:", error);
      throw new Error("Failed to fetch legal case");
    }
  }

  async createLegalCase(insertLegalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase> {
    try {
      // For now, let's create a temporary user if none exists
      let userId = 1;
      const [existingUser] = await db.select().from(users).limit(1);

      if (!existingUser) {
        const [newUser] = await db.insert(users).values({
          username: "temporary_user",
          email: "temp@example.com",
          passwordHash: "temporary"
        }).returning();
        userId = newUser.id;
      } else {
        userId = existingUser.id;
      }

      const [legalCase] = await db
        .insert(legalCases)
        .values({
          ...insertLegalCase,
          userId
        })
        .returning();
      return legalCase;
    } catch (error) {
      console.error("Error creating legal case:", error);
      throw new Error("Failed to create legal case");
    }
  }
}

export const storage = new DatabaseStorage();