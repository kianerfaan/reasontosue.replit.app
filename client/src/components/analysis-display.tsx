import { type LegalCase } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisDisplayProps {
  case: LegalCase;
}

/**
 * Formats the analysis text by converting markdown-like syntax to HTML
 * @param text - Raw analysis text from the API
 * @returns Formatted HTML string
 */
function formatAnalysisText(text: string): string {
  return text
    // Convert headers
    .replace(
      /\*\*(.*?)\*\*/g, 
      '<h3 class="text-lg font-semibold text-[#003366] mt-6 mb-3">$1</h3>'
    )
    // Convert underlined text
    .replace(
      /__(.*?)__/g, 
      '<u class="text-lg font-medium">$1</u>'
    )
    // Convert line breaks
    .replace(/\n/g, '<br />');
}

/**
 * AnalysisDisplay Component
 * Displays the legal case details and analysis in a structured format
 */
export default function AnalysisDisplay({ case: legalCase }: AnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Case Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-[#003366]">
            Case Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {/* Description Section */}
            <div>
              <dt className="font-semibold text-[#333333]">Description</dt>
              <dd className="mt-1">{legalCase.description}</dd>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <dt className="font-semibold text-[#333333]">Jurisdiction</dt>
                <dd className="mt-1">{legalCase.jurisdiction}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Legal Analysis Card */}
      <Card className="bg-[#F8F9FA]">
        <CardHeader>
          <CardTitle className="font-serif text-[#003366]">
            Legal Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none space-y-4"
            dangerouslySetInnerHTML={{ 
              __html: legalCase.analysis ? formatAnalysisText(legalCase.analysis) : ''
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}