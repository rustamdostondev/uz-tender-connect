
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TendersList from "@/components/tenders/TendersList";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Tender } from "@/types/tender";
import { useToast } from "@/components/ui/use-toast";

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTenders();
  }, [activeTab]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      let query = supabase.from('tenders').select('*');
      
      if (activeTab === 'open') {
        query = query.eq('status', 'open');
      } else if (activeTab === 'closed') {
        query = query.in('status', ['closed', 'in_review', 'awarded']);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTenders(data || []);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast({
        title: "Error",
        description: "Failed to load tenders. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTenders = tenders.filter(tender => 
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Tenders</h1>
          {isAuthenticated && (
            <Link to="/tenders/create">
              <Button>Create New Tender</Button>
            </Link>
          )}
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tenders</TabsTrigger>
            <TabsTrigger value="open">Open Tenders</TabsTrigger>
            <TabsTrigger value="closed">Closed Tenders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <TendersList tenders={filteredTenders} loading={loading} />
          </TabsContent>
          
          <TabsContent value="open" className="space-y-4">
            <TendersList tenders={filteredTenders} loading={loading} />
          </TabsContent>
          
          <TabsContent value="closed" className="space-y-4">
            <TendersList tenders={filteredTenders} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
