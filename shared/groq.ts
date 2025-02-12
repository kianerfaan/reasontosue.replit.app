import { Groq } from "groq-sdk";

if (!process.env.GROQ_API_KEY_3) {
  throw new Error("GROQ_API_KEY_3 is not set");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY_3,
});

export interface TariffResponse {
  rate: string;
  informationDate: string;
}

export async function getTariffRate(importerCountry: string, exporterCountry: string, productDescription: string): Promise<TariffResponse> {
  try {
    const prompt = `You are a tariff classification expert. Analyze this trade scenario using the following systematic approach:

1. First, determine the exact HTS (Harmonized Tariff Schedule) code for the product:
   Product: ${productDescription}

2. Based on the HTS code, determine the most recent applicable tariff rate for:
   - Importing to: ${importerCountry}
   - Exporting from: ${exporterCountry}

Requirements:
- Only provide rates from official tariff schedules
- If multiple HTS codes could apply, use the most specific one
- Return "Rate Uncertain" if you cannot determine the exact rate
- IMPORTANT: For any given product between the same countries, strive to return consistent rates
- Always include the effective date of the rate using this format: "Effective: YYYY-MM-DD" or "As of: Month YYYY"
- For US imports, refer to the HTSUS (Harmonized Tariff Schedule of the United States)
- For other countries, cite the specific tariff schedule used

Format your response in this exact structure:
1. HTS Code: [specific code]
2. Tariff Rate: [X%]
3. Source: [specific tariff schedule reference]
4. Effective Date: [date of the tariff schedule]
5. Notes: [any important caveats or clarifications]

Note: If the most recent data available is from your training data, explicitly state "As of: 2023 (Model Cutoff)".`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.1, 
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    if (!response) {
      throw new Error("No response received from GROQ API");
    }

    // Extract percentage from the response
    const percentageMatch = response.match(/\d+(?:\.\d+)?%|Rate Uncertain/);
    const rate = percentageMatch ? percentageMatch[0] : "Rate Uncertain";

    // Enhanced date extraction
    const datePatterns = [
      /Effective Date:\s*([A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2})/i,
      /As of:\s*([A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2})/i,
      /Updated:\s*([A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2})/i,
      /Valid from:\s*([A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2})/i
    ];

    let informationDate = "2023 (Model Cutoff)";
    for (const pattern of datePatterns) {
      const match = response.match(pattern);
      if (match && match[1]) {
        informationDate = match[1];
        break;
      }
    }

    return {
      rate,
      informationDate,
    };
  } catch (error) {
    console.error("GROQ API Error:", error);
    return {
      rate: "Rate Uncertain",
      informationDate: "2023 (Model Cutoff)",
    };
  }
}