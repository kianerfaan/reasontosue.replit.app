import { type LegalCase } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AnalysisDisplayProps {
  case: LegalCase;
}

function formatAnalysisText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold text-[#003366] mt-6 mb-3">$1</h3>')
    .replace(/__(.*?)__/g, '<u class="text-lg font-medium">$1</u>')
    .replace(/\n/g, '<br />');
}

export default function AnalysisDisplay({ case: legalCase }: AnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-[#003366]">Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold text-[#333333]">Description</dt>
              <dd className="mt-1">{legalCase.description}</dd>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="font-semibold text-[#333333]">Jurisdiction</dt>
                <dd className="mt-1">{legalCase.jurisdiction}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#333333]">Incident Date</dt>
                <dd className="mt-1">{legalCase.incidentDate}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="bg-[#F8F9FA]">
        <CardHeader>
          <CardTitle className="font-serif text-[#003366]">Legal Analysis</CardTitle>
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