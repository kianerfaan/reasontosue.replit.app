import { users, type User, type InsertUser } from "@shared/schema";
import { type LegalCase, type InsertLegalCase } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLegalCase(id: number): Promise<LegalCase | undefined>;
  createLegalCase(legalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cases: Map<number, LegalCase>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getLegalCase(id: number): Promise<LegalCase | undefined> {
    return this.cases.get(id);
  }

  async createLegalCase(insertLegalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase> {
    const id = this.currentId++;
    const now = new Date();
    const legalCase: LegalCase = {
      ...insertLegalCase,
      id,
      createdAt: now,
    };
    this.cases.set(id, legalCase);
    return legalCase;
  }
}

export const storage = new MemStorage();