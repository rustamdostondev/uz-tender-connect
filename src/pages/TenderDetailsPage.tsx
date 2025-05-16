import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OfferCard from "@/components/offers/OfferCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tender, Offer, TenderStatus } from "@/types/tender";
import { useAuth } from "@/contexts/AuthContext";

export default function TenderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch tender details
  const { data: tender, isLoading: isTenderLoading, error: tenderError } = useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      if (!id) throw new Error("Tender ID is required");
      
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Tender;
    }
  });
  
  // Fetch offers for the tender
  const { data: offers = [], isLoading: areOffersLoading } = useQuery({
    queryKey: ['offers', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('offers')
        .select('*, profiles!inner(*)')
        .eq('tender_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Type assertion to handle the profiles structure
      return data as unknown as Offer[];
    },
    enabled: !!id && !!user
  });

  // Mutation to update tender status
  const updateTenderStatus = useMutation({
    mutationFn: async (status: TenderStatus) => {
      if (!id) throw new Error("Tender ID is required");
      
      const { data, error } = await supabase
        .from('tenders')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The tender status has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle errors
  useEffect(() => {
    if (tenderError) {
      toast({
        title: "Error loading tender",
        description: (tenderError as Error).message,
        variant: "destructive"
      });
    }
  }, [tenderError, toast]);
  
  if (isTenderLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-8 w-64 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
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
              The tender you are looking for does not exist or was removed.
            </p>
            <Link to="/tenders">
              <Button>Browse Tenders</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const statusColors = {
    open: "bg-status-open",
    in_review: "bg-status-pending",
    awarded: "bg-status-accepted",
    closed: "bg-status-closed",
  };
  
  const statusLabels = {
    open: "Open",
    in_review: "In Review",
    awarded: "Awarded",
    closed: "Closed",
  };

  const isOwner = user && user.id === tender.user_id;
  const canMakeOffer = user && user.id !== tender.user_id && tender.status === 'open';
  const fileUrl = tender.file_url ? tender.file_url : null;

  // Function to handle making an offer
  const handleMakeOffer = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to make an offer.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/tenders/${id}` } });
      return;
    }
    // Navigate to make offer page (to be implemented)
    navigate(`/tenders/${id}/offer/new`);
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${statusColors[tender.status]}`}>
                {statusLabels[tender.status]}
              </Badge>
              <Link to={`/tenders?category=${tender.category}`} className="text-sm text-muted-foreground hover:underline">
                {tender.category}
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{tender.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Posted {format(new Date(tender.created_at), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex gap-2">
            {isOwner && tender.status === 'open' && (
              <Button 
                variant="outline" 
                onClick={() => updateTenderStatus.mutate('closed')}
                disabled={updateTenderStatus.isPending}
              >
                Close Tender
              </Button>
            )}
            {canMakeOffer && (
              <Button onClick={handleMakeOffer}>Make an Offer</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Tender Details</TabsTrigger>
                <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="border rounded-lg p-6 mt-4">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="mb-6 whitespace-pre-wrap">{tender.description}</p>
                  
                  {fileUrl && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-medium mb-4">Attachments</h3>
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        Download Attachment
                      </a>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Budget</div>
                        <div className="font-medium">${Number(tender.budget).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Deadline</div>
                        <div className="font-medium">
                          {format(new Date(tender.deadline), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="offers" className="mt-4">
                <div className="border rounded-lg p-6">
                  {!user ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">Login to view offers</h3>
                      <p className="text-muted-foreground mb-4">
                        You need to be logged in to view and manage offers.
                      </p>
                      <Link to="/login" state={{ from: `/tenders/${id}` }}>
                        <Button>Login</Button>
                      </Link>
                    </div>
                  ) : areOffersLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : offers.length > 0 ? (
                    <div className="space-y-4">
                      {offers.map(offer => (
                        <OfferCard 
                          key={offer.id}
                          id={offer.id}
                          tender_id={offer.tender_id}
                          user_id={offer.user_id} 
                          price={offer.price}
                          delivery_time={offer.delivery_time}
                          message={offer.message}
                          file_url={offer.file_url}
                          status={offer.status}
                          created_at={offer.created_at}
                          isOwner={isOwner}
                          canRespond={isOwner && tender.status === 'open'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">No offers yet</h3>
                      <p className="text-muted-foreground">
                        {isOwner 
                          ? "No one has made an offer for this tender yet."
                          : "Be the first to make an offer for this tender."}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tender Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-bold text-xl">${Number(tender.budget).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Deadline</div>
                    <div className="font-medium">
                      {format(new Date(tender.deadline), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{tender.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge className={`${statusColors[tender.status]} mt-1`}>
                      {statusLabels[tender.status]}
                    </Badge>
                  </div>
                  {canMakeOffer && (
                    <div className="pt-4">
                      <Button className="w-full" onClick={handleMakeOffer}>
                        Make an Offer
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
