
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const offerFormSchema = z.object({
  price: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  delivery_time: z.string()
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Delivery time must be a positive number of days",
    }),
  message: z.string()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

export default function MakeOfferPage() {
  const { id: tenderId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      price: "",
      delivery_time: "",
      message: "",
    },
  });

  // Fetch tender details
  const { data: tender, isLoading } = useQuery({
    queryKey: ['tender', tenderId],
    queryFn: async () => {
      if (!tenderId) throw new Error("Tender ID is required");
      
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', tenderId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Create offer mutation
  const createOffer = useMutation({
    mutationFn: async (values: z.infer<typeof offerFormSchema>) => {
      if (!user) throw new Error("User not authenticated");
      if (!tenderId) throw new Error("Tender ID is required");

      try {
        // First upload file if present
        let fileUrl = null;
        if (file) {
          setIsUploading(true);
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from('offers')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from('offers')
            .getPublicUrl(fileName);
          
          fileUrl = urlData.publicUrl;
          setIsUploading(false);
        }
        
        // Insert offer record
        const { data, error } = await supabase
          .from('offers')
          .insert({
            user_id: user.id,
            tender_id: tenderId,
            price: parseFloat(values.price),
            delivery_time: parseInt(values.delivery_time),
            message: values.message,
            file_url: fileUrl,
            status: 'pending',
          })
          .select();
          
        if (error) throw error;
        
        // Update tender status to in_review if it's currently open
        if (tender?.status === 'open') {
          await supabase
            .from('tenders')
            .update({ status: 'in_review' })
            .eq('id', tenderId);
        }
        
        return data[0];
      } catch (error) {
        console.error("Error creating offer:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Offer submitted successfully",
        description: "Your offer has been sent to the tender owner.",
      });
      navigate(`/tenders/${tenderId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting offer",
        description: error.message || "There was a problem submitting your offer.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  // Form submission
  const onSubmit = (values: z.infer<typeof offerFormSchema>) => {
    createOffer.mutate(values);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-full mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Tender Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tender you are trying to make an offer for does not exist.
            </p>
            <Button onClick={() => navigate('/tenders')}>Browse Tenders</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (tender.status !== 'open') {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Tender Not Available</h1>
            <p className="text-muted-foreground mb-6">
              This tender is no longer accepting offers.
            </p>
            <Button onClick={() => navigate('/tenders')}>Browse Other Tenders</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (user && tender.user_id === user.id) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Cannot Make Offer</h1>
            <p className="text-muted-foreground mb-6">
              You cannot make an offer on your own tender.
            </p>
            <Button onClick={() => navigate('/tenders')}>Browse Other Tenders</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Make an Offer</h1>
          <p className="text-muted-foreground mb-8">
            Submit your proposal for: <span className="font-medium">{tender.title}</span>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter your price" 
                          min="0" 
                          step="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Tender budget: ${Number(tender.budget).toLocaleString()}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="delivery_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Number of days" 
                          min="1"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        How long will it take you to complete?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Proposal</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your approach, experience, and why you're the best fit for this project..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about how you'll address the requirements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Attachment (Optional)</FormLabel>
                <div className="border border-input rounded-md p-4">
                  <label htmlFor="offerFile" className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Click to upload file"}
                    </span>
                  </label>
                  <input
                    id="offerFile"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <FormDescription>
                  Upload any relevant documents, portfolio samples or project proposals (max 10MB).
                </FormDescription>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/tenders/${tenderId}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createOffer.isPending || isUploading}
                >
                  {createOffer.isPending || isUploading ? "Submitting..." : "Submit Offer"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
