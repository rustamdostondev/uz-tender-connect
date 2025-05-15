
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import TenderCard from "./TenderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Tender } from "@/types/tender";
import { Skeleton } from "@/components/ui/skeleton";

interface TendersListProps {
  showFilters?: boolean;
  userId?: string;
}

export default function TendersList({ showFilters = true, userId }: TendersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  // Fetch categories from unique values in tenders
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['tenderCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Get unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(item => item.category))
      );
      
      return uniqueCategories;
    }
  });

  // Fetch tenders from Supabase
  const { data: tenders = [], isLoading: tendersLoading } = useQuery({
    queryKey: ['tenders', userId],
    queryFn: async () => {
      let query = supabase
        .from('tenders')
        .select('*');
      
      // If userId is provided, filter by user_id
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Tender[];
    }
  });

  // Statuses from the enum
  const statuses = ["open", "closed", "in_review", "awarded"];
  
  const budgetRanges = [
    { value: "all", label: "All" },
    { value: "0-100", label: "Under $100" },
    { value: "100-500", label: "100-500" },
    { value: "500-1000", label: "500-1,000" },
    { value: "1000-5000", label: "1,000-5,000" },
    { value: "5000+", label: "Over $5,000" }
  ];

  const filteredTenders = tenders.filter(tender => {
    // Search filter
    const matchesSearch = searchTerm
      ? tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Category filter
    const matchesCategory = categoryFilter === 'all' || tender.category === categoryFilter;

    // Status filter
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;

    // Budget filter
    let matchesBudget = true;
    if (budgetFilter !== 'all') {
      const budget = Number(tender.budget);
      if (budgetFilter === '0-100') matchesBudget = budget <= 100;
      else if (budgetFilter === '100-500') matchesBudget = budget > 100 && budget <= 500;
      else if (budgetFilter === '500-1000') matchesBudget = budget > 500 && budget <= 1000;
      else if (budgetFilter === '1000-5000') matchesBudget = budget > 1000 && budget <= 5000;
      else if (budgetFilter === '5000+') matchesBudget = budget > 5000;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesBudget;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setBudgetFilter("all");
  };

  // Loading state
  if (tendersLoading) {
    return (
      <div className="w-full">
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="text-lg font-medium mb-4">Filters</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="text-lg font-medium mb-4">Filters</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="search"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">
                Budget
              </label>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="mr-2"
            >
              Reset
            </Button>
            <Button>Apply Filters</Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenders.length > 0 ? (
          filteredTenders.map((tender) => (
            <TenderCard key={tender.id} {...tender} />
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            <h3 className="text-lg font-medium">No tenders found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
