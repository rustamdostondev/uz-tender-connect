
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OfferCard from "@/components/offers/OfferCard";
import { mockTenders, mockOffers } from "@/data/mockData";
import { format } from "date-fns";

export default function TenderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  
  // In a real app, we would fetch this data from an API
  const tender = mockTenders.find(tender => tender.id === id);
  const offers = mockOffers.filter(offer => offer.tenderId === id);
  
  if (!tender) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Tender Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tender you are looking for does not exist.
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
    pending: "bg-status-pending",
    accepted: "bg-status-accepted",
    rejected: "bg-status-rejected",
    closed: "bg-status-closed",
  };
  
  const statusLabels = {
    open: "Open",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    closed: "Closed",
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
              <Link to="/tenders" className="text-sm text-muted-foreground hover:underline">
                {tender.category}
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{tender.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Posted {format(new Date(tender.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Share</Button>
            <Button>Make an Offer</Button>
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
                  <p className="mb-6">{tender.description}</p>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Budget</div>
                        <div className="font-medium">${tender.budget.toLocaleString()}</div>
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
                  {offers.length > 0 ? (
                    <div className="space-y-4">
                      {offers.map(offer => (
                        <OfferCard 
                          key={offer.id} 
                          {...offer} 
                          canRespond={true} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">No offers yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to make an offer for this tender.
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
                    <div className="font-bold text-xl">${tender.budget.toLocaleString()}</div>
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
                  <div className="pt-4">
                    <Button className="w-full">Make an Offer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
