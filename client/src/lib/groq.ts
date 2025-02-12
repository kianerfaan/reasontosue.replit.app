import { getTariffRate } from "@shared/groq";
import type { TariffQuery } from "@shared/schema";

export async function queryTariff(data: {
  importerCountry: string;
  exporterCountry: string;
  productDescription: string;
}): Promise<TariffQuery> {
  const res = await fetch("/api/tariff/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to retrieve tariff information");
  }

  return res.json();
}