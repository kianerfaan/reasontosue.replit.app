import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLegalCaseSchema } from "@shared/schema";
import { ZodError } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client with Groq configuration
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY_2,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Generates a legal analysis using AI for the given case details
 * @param caseDetails - Description and jurisdiction of the legal case
 * @returns Analysis and response text for the case
 */
async function analyzeWithAI(caseDetails: string): Promise<{ analysis: string; response: string }> {
  try {
    console.log("Starting AI analysis with details:", caseDetails);
    const today = new Date().toISOString().split('T')[0];

    // Generate AI analysis using Groq API
    const response = await openai.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `You are a legal analysis assistant. Format your response with the following structure:

__YES/NO: Clear statement if there are potential legal claims__

**Initial Assessment**
[Brief explanation of the initial assessment]

**Potential Causes of Action**
[List and explain potential legal claims]

**Key Legal Theories**
[Explain relevant legal principles]

**Jurisdictional Considerations**
[Analyze where the case could be filed]

**Statute of Limitations Analysis**
[Be very clear about deadlines and whether time remains to file]

**Recommended Next Steps**
[Actionable steps for the inquirer]

**Potential Challenges and Risks**
[Key obstacles and considerations]

End with:
__Final Recommendation: Clear YES/NO if there is a reason to sue__`
        },
        {
          role: "user",
          content: `${caseDetails}\nIncident Date: ${today}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const analysis = response.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error("No analysis content received from API");
    }

    // Calculate statute of limitations date
    const incident = new Date(today);
    const statuteYears = 3; // Default to 3 years if not specified
    const statuteDate = new Date(incident);
    statuteDate.setFullYear(statuteDate.getFullYear() + statuteYears);

    const responseText = `Based on today's date (${incident.toLocaleDateString()}), and the applicable statute of limitations, legal action must be initiated before ${statuteDate.toLocaleDateString()} to preserve your rights.`;

    return { analysis, response: responseText };
  } catch (error) {
    console.error("Error calling Groq API:", error instanceof Error ? error.message : String(error));
    throw new Error("Failed to generate legal analysis");
  }
}

/**
 * Registers API routes for the legal analysis application
 * @param app - Express application instance
 * @returns HTTP server instance
 */
export function registerRoutes(app: Express): Server {
  // POST /api/analyze - Generate legal analysis for a case
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate request body against schema
      const caseData = insertLegalCaseSchema.parse(req.body);
      console.log("Received case data:", caseData);

      // Generate AI analysis
      const { analysis, response } = await analyzeWithAI(
        `Description: ${caseData.description}\nJurisdiction: ${caseData.jurisdiction}`
      );

      // Save case to database
      const savedCase = await storage.createLegalCase({
        ...caseData,
        analysis,
        response
      });

      console.log("Saved case with analysis:", savedCase);
      res.json(savedCase);
    } catch (error) {
      console.error("Error in /api/analyze:", error instanceof Error ? error.message : String(error));

      // Handle validation errors separately
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Internal server error" 
        });
      }
    }
  });

  // GET /api/cases/:id - Retrieve a specific case
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
      console.error("Error in /api/cases/:id:", error instanceof Error ? error.message : String(error));
      res.status(500).json({ message: "Failed to retrieve case" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}