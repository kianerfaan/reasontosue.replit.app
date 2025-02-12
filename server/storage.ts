import { type User, type InsertUser, type LegalCase, type InsertLegalCase } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLegalCase(id: number): Promise<LegalCase | undefined>;
  createLegalCase(legalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase>;
}

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private legalCases: LegalCase[] = [];
  private userId = 1;
  private legalCaseId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      ...insertUser,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async getLegalCase(id: number): Promise<LegalCase | undefined> {
    return this.legalCases.find(legalCase => legalCase.id === id);
  }

  async createLegalCase(insertLegalCase: InsertLegalCase & { analysis: string }): Promise<LegalCase> {
    // For now, let's create a temporary user if none exists
    let userId = 1;
    const existingUser = this.users[0];

    if (!existingUser) {
      const newUser = await this.createUser({
        username: "temporary_user",
        email: "temp@example.com",
        passwordHash: "temporary"
      });
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    const legalCase: LegalCase = {
      id: this.legalCaseId++,
      userId,
      ...insertLegalCase,
      createdAt: new Date()
    };
    this.legalCases.push(legalCase);
    return legalCase;
  }
}

export const storage = new MemoryStorage();