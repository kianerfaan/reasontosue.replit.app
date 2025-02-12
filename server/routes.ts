import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTariffQuerySchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";
import { getTariffRate } from "@shared/groq";

export function registerRoutes(app: Express) {
  app.get("/api/tariff/recent", async (_req, res) => {
    const queries = await storage.getRecentQueries(5);
    res.json(queries);
  });

  app.post("/api/tariff/query", async (req, res) => {
    try {
      // First validate the form data without tariffRate
      const formData = req.body;

      // Get tariff rate from GROQ API
      const tariffInfo = await getTariffRate(
        formData.importerCountry,
        formData.exporterCountry,
        formData.productDescription
      );

      // Validate the complete data including tariffRate and informationDate
      const data = insertTariffQuerySchema.parse({
        ...formData,
        tariffRate: tariffInfo.rate,
        informationDate: tariffInfo.informationDate
      });

      const query = await storage.createTariffQuery(data);

      res.json(query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error('Error processing tariff query:', error);
        res.status(500).json({ message: "Failed to retrieve tariff information" });
      }
    }
  });

  app.post("/api/tariff/feedback", async (req, res) => {
    try {
      const data = insertFeedbackSchema.parse(req.body);
      await storage.addQueryFeedback(data);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      } else {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: "Failed to save feedback" });
      }
    }
  });

  return createServer(app);
}