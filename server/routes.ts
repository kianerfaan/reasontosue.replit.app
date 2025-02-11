import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLegalCaseSchema } from "@shared/schema";
import { ZodError } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY_2,
  baseURL: "https://api.groq.com/openai/v1",
});

async function analyzeWithAI(caseDetails: string): Promise<string> {
  try {
    console.log("Starting AI analysis with details:", caseDetails);

    const response = await openai.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `You are a legal analysis assistant. Begin your response with a clear "YES" or "NO" indicating whether there are potential legal claims, followed by a comprehensive analysis with these highlighted sections:

# Initial Assessment
[Clear YES/NO statement and brief explanation why]

# I. Potential Causes of Action
[List and explain potential legal claims]

# II. Key Legal Theories
[Explain relevant legal principles]

# III. Jurisdictional Considerations
[Analyze where the case could be filed]

# IV. Statute of Limitations Analysis
[IMPORTANT: Be very clear about deadlines and whether time remains to file]

# V. Recommended Next Steps
[Actionable steps for the inquirer]

# VI. Potential Challenges and Risks
[Key obstacles and considerations]

Format your response in a clear, structured manner with these exact headings.`
        },
        {
          role: "user",
          content: caseDetails
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const analysis = response.choices[0]?.message?.content;
    console.log("Received AI analysis:", analysis);

    if (!analysis) {
      throw new Error("No analysis content received from API");
    }

    return analysis;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to generate legal analysis: " + error.message);
  }
}

export function registerRoutes(app: Express): Server {
  app.post("/api/analyze", async (req, res) => {
    try {
      const caseData = insertLegalCaseSchema.parse(req.body);
      console.log("Received case data:", caseData);

      const analysis = await analyzeWithAI(
        `Description: ${caseData.description}\nJurisdiction: ${caseData.jurisdiction}`
      );

      const savedCase = await storage.createLegalCase({
        ...caseData,
        analysis
      });

      console.log("Saved case with analysis:", savedCase);
      res.json(savedCase);
    } catch (error) {
      console.error("Error in /api/analyze:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message || "Internal server error" });
      }
    }
  });

  app.get("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Fetching case:", id);

      const legalCase = await storage.getLegalCase(id);
      console.log("Retrieved case:", legalCase);

      if (!legalCase) {
        res.status(404).json({ message: "Case not found" });
        return;
      }

      res.json(legalCase);
    } catch (error) {
      console.error("Error in /api/cases/:id:", error);
      res.status(500).json({ message: "Failed to retrieve case" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}