
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Categories for tenders
const categories = [
  "Design",
  "Development",
  "Marketing",
  "Content",
  "Branding",
  "Software",
  "Consulting",
  "Other",
];

// Form validation schema
const tenderFormSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z.string()
    .min(20, { message: "Description must be at least 20 characters" }),
  budget: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Budget must be a positive number",
    }),
  deadline: z.date({
    required_error: "Deadline is required",
  }).refine(date => date > new Date(), {
    message: "Deadline must be in the future",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
});

export default function CreateTenderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof tenderFormSchema>>({
    resolver: zodResolver(tenderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      category: "",
    },
  });

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Create tender mutation
  const createTender = useMutation({
    mutationFn: async (values: z.infer<typeof tenderFormSchema>) => {
      if (!user) throw new Error("User not authenticated");

      try {
        // First upload file if present
        let fileUrl = null;
        if (file) {
          setIsUploading(true);
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from('tender_files')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from('tender_files')
            .getPublicUrl(fileName);
          
          fileUrl = urlData.publicUrl;
          setIsUploading(false);
        }
        
        // Insert tender record
        const { data, error } = await supabase
          .from('tenders')
          .insert({
            user_id: user.id,
            title: values.title,
            description: values.description,
            budget: parseFloat(values.budget),
            deadline: values.deadline.toISOString(),
            category: values.category,
            file_url: fileUrl,
            status: 'open',
          })
          .select();
          
        if (error) throw error;
        
        return data[0];
      } catch (error) {
        console.error("Error creating tender:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Tender created successfully",
        description: "Your tender has been published.",
      });
      navigate(`/tenders/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating tender",
        description: error.message || "There was a problem creating your tender.",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: z.infer<typeof tenderFormSchema>) => {
    createTender.mutate(values);
  };

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Create a Tender</h1>
          <p className="text-muted-foreground mb-8">
            Describe what you need and set your budget
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Design a logo for my startup" {...field} />
                    </FormControl>
                    <FormDescription>
                      Keep it short and clear.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of what you need..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include all details that would help contractors understand your requirements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          min="0" 
                          step="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When do you need this project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Attachment (Optional)</FormLabel>
                <div className="border border-input rounded-md p-4">
                  <label htmlFor="file" className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Click to upload file"}
                    </span>
                  </label>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <FormDescription>
                  Upload any relevant documents or images (max 10MB).
                </FormDescription>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTender.isPending || isUploading}
                >
                  {createTender.isPending || isUploading ? "Submitting..." : "Create Tender"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
