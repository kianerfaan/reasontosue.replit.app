import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Search, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { countries } from "@/lib/countries";
import { queryTariff } from "@/lib/groq";
import type { TariffFormData, TariffQuery } from "@shared/schema";
import { tariffFormSchema } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, boolean | null>>({});

  const form = useForm<TariffFormData>({
    resolver: zodResolver(tariffFormSchema),
    defaultValues: {
      importerCountry: "us",
      exporterCountry: "ca",
      productDescription: "",
    },
  });

  const recentQueries = useQuery<TariffQuery[]>({ 
    queryKey: ["/api/tariff/recent"]
  });

  const tariffMutation = useMutation({
    mutationFn: queryTariff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tariff/recent"] });
      toast({
        title: "Success",
        description: "Successfully retrieved tariff information",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to retrieve tariff information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TariffFormData) => {
    tariffMutation.mutate(data);
  };

  const submitFeedback = async (queryId: number, isPositive: boolean) => {
    // If feedback was already given and it's the same, do nothing
    if (feedbackGiven[queryId] === isPositive) return;

    try {
      await fetch('/api/tariff/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryId,
          isPositive,
        }),
      });

      setFeedbackGiven(prev => ({
        ...prev,
        [queryId]: isPositive
      }));

      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF]">
      <div className="flex-grow p-4 md:p-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between text-[#0A4D68] transition-all duration-300 py-4">
            <div className="flex items-center gap-3 hover:transform hover:translate-y-[-2px]">
              <TrendingUp className="h-8 w-8" />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">MyTariffs.com</h1>
            </div>
            <a 
              href="https://github.com/kianerfaan/MyTariffs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#116A8C] transition-colors duration-200"
            >
              <SiGithub className="h-6 w-6" />
              <span className="md:inline">Visit on GitHub</span>
            </a>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="importerCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0A4D68] font-medium">Importer Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 transition-all duration-200 hover:border-[#0A4D68]">
                                <SelectValue placeholder="Select importer country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem 
                                  key={country.value} 
                                  value={country.value}
                                  className="hover:bg-[#F0F9FF] transition-colors duration-200"
                                >
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exporterCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0A4D68] font-medium">Exporter Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 transition-all duration-200 hover:border-[#0A4D68]">
                                <SelectValue placeholder="Select exporter country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem 
                                  key={country.value} 
                                  value={country.value}
                                  className="hover:bg-[#F0F9FF] transition-colors duration-200"
                                >
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0A4D68] font-medium">Product Description</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter product description (e.g., Steel, Cars, Electronics)" 
                              {...field} 
                              className="h-12 transition-all duration-200 hover:border-[#0A4D68]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-[#0A4D68] hover:bg-[#116A8C] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-[1px]"
                      disabled={tariffMutation.isPending}
                    >
                      {tariffMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-[#0A4D68] text-xl font-semibold">Recent Queries</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentQueries.isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : recentQueries.data ? (
                  <div className="space-y-4">
                    {recentQueries.data.map((query: TariffQuery) => (
                      <Card key={query.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-r from-white to-[#F8FAFC]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-[#0A4D68]">{query.productDescription}</p>
                              <p className="text-sm text-[#64748B] mt-1">
                                {countries.find(c => c.value === query.importerCountry)?.label} → {countries.find(c => c.value === query.exporterCountry)?.label}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#0A4D68]">{query.tariffRate}</p>
                              <p className="text-xs text-[#64748B] mt-1">
                                {query.informationDate}
                              </p>
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`transition-all duration-200 ${
                                    feedbackGiven[query.id] === true
                                      ? "bg-green-100 text-green-600"
                                      : "hover:text-green-600 hover:bg-green-50"
                                  }`}
                                  onClick={() => submitFeedback(query.id, true)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`transition-all duration-200 ${
                                    feedbackGiven[query.id] === false
                                      ? "bg-red-100 text-red-600"
                                      : "hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  onClick={() => submitFeedback(query.id, false)}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#64748B]">No recent queries</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mt-auto backdrop-blur-sm bg-white/80 border-t border-[#E2E8F0] py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="text-sm text-[#64748B] text-center">
            <p className="mb-2">© 2025 All Rights Reserved.</p>
            <p className="text-xs max-w-2xl mx-auto">
              MyTariffs.com provides tariff data for informational purposes only, without warranty or liability. 
              Use at your own risk; no legal, financial, or regulatory advice is offered.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}