import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertLegalCaseSchema, type InsertLegalCase } from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

/**
 * CaseForm Component
 * Handles the submission and validation of legal case details
 */
export default function CaseForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Initialize form with Zod schema validation
  const form = useForm<InsertLegalCase>({
    resolver: zodResolver(insertLegalCaseSchema),
    defaultValues: {
      description: "",
      jurisdiction: "",
    }
  });

  // Handle form submission and API interaction
  const mutation = useMutation({
    mutationFn: async (data: InsertLegalCase) => {
      const res = await apiRequest("POST", "/api/analyze", data);
      return res.json();
    },
    onSuccess: (data) => {
      setLocation(`/analysis/${data.id}`);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit case. Please try again."
      });
    }
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
        className="space-y-6"
      >
        {/* Case Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe your situation in detail, including when it happened and all parties involved (e.g., employers, businesses, individuals)"
                  className="h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jurisdiction Field */}
        <FormField
          control={form.control}
          name="jurisdiction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jurisdiction</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., California, USA" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#003366] hover:bg-[#002244]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Analyzing..." : "Get Legal Analysis"}
        </Button>
      </form>
    </Form>
  );
}
