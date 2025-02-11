import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import AnalysisDisplay from "@/components/analysis-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { LegalCase } from "@shared/schema";

export default function Analysis() {
  const [, params] = useRoute("/analysis/:id");
  const id = params?.id;

  const { data: legalCase, isLoading, error } = useQuery<LegalCase>({
    queryKey: [`/api/cases/${id}`],
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <NavHeader />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-64" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : "Failed to load analysis. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {legalCase && <AnalysisDisplay case={legalCase} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}