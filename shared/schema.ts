import { z } from "zod";

// Types for User
export type User = {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

// Types for LegalCase
export type LegalCase = {
  id: number;
  userId: number;
  description: string;
  jurisdiction: string;
  analysis?: string;
  incidentDate?: string;
  response?: string;
  createdAt: Date;
};

// Schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
}).strict();

export const insertLegalCaseSchema = z.object({
  description: z.string().min(10).max(2000),
  jurisdiction: z.string().min(2).max(100),
  incidentDate: z.string().optional(),
  response: z.string().optional(),
}).strict();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;