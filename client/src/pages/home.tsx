import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CaseForm from "@/components/case-form";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import { Scale } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <NavHeader />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Scale className="h-16 w-16 text-[#003366]" />
            </div>
            <h1 className="text-4xl font-serif text-[#333333] mb-4">
              Do I Have a Reason to Sue?
            </h1>
            <p className="text-lg text-[#666666] mb-8">
              Get Preliminary Legal Analysis
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#003366]">
                Submit Your Case Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CaseForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}