
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenderCard from "@/components/tenders/TenderCard";
import { supabase } from '@/integrations/supabase/client';
import { Tender } from "@/types/tender";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [featuredTenders, setFeaturedTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedTenders();
  }, []);

  const fetchFeaturedTenders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        throw error;
      }
      
      setFeaturedTenders(data || []);
    } catch (error) {
      console.error('Error fetching featured tenders:', error);
      toast({
        title: "Error",
        description: "Failed to load featured tenders. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Uzbekistan's Premier Tender Platform
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              OpenTender.uz connects businesses with opportunities. Post tenders, receive competitive bids, and find the perfect partners for your projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tenders">
                <Button size="lg" variant="secondary">
                  Browse Tenders
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured tenders section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Tenders</h2>
            <Link to="/tenders">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredTenders.map(tender => (
                <TenderCard
                  key={tender.id}
                  id={tender.id}
                  title={tender.title}
                  description={tender.description}
                  budget={tender.budget}
                  deadline={tender.deadline}
                  category={tender.category}
                  status={tender.status}
                  created_at={tender.created_at}
                  user_id={tender.user_id}
                />
              ))
            )}
            
            {!loading && featuredTenders.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No tenders available at the moment.</p>
                <p className="mt-2">Check back soon or create your own tender.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-muted px-4 py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Your Tender</h3>
              <p className="text-muted-foreground">
                Create a detailed tender with your requirements, budget, and deadline.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Offers</h3>
              <p className="text-muted-foreground">
                Get competitive offers from qualified providers across Uzbekistan.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Select the Best Offer</h3>
              <p className="text-muted-foreground">
                Review offers, select the best one, and start your project with confidence.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Popular Categories</h2>

          <Tabs defaultValue="construction">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 justify-center">
              <TabsTrigger value="construction">Construction</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="consulting">Consulting</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="construction" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Building & Infrastructure</h3>
                    <p className="text-muted-foreground mb-4">
                      Projects related to building construction, roads, bridges, and infrastructure development.
                    </p>
                    <Link to="/tenders?category=construction">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Renovation & Repairs</h3>
                    <p className="text-muted-foreground mb-4">
                      Projects focused on renovating existing structures, repairs, and maintenance.
                    </p>
                    <Link to="/tenders?category=renovation">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="technology" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Software Development</h3>
                    <p className="text-muted-foreground mb-4">
                      Custom software development, web and mobile applications, and enterprise solutions.
                    </p>
                    <Link to="/tenders?category=software">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">IT Infrastructure</h3>
                    <p className="text-muted-foreground mb-4">
                      Network setup, hardware supplies, data centers, and cloud infrastructure.
                    </p>
                    <Link to="/tenders?category=it-infrastructure">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="consulting" className="space-y-6">
              {/* Similar structure for consulting category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Business Consulting</h3>
                    <p className="text-muted-foreground mb-4">
                      Business strategy, market analysis, and organizational development.
                    </p>
                    <Link to="/tenders?category=business-consulting">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Financial Advisory</h3>
                    <p className="text-muted-foreground mb-4">
                      Financial planning, auditing, and investment advisory services.
                    </p>
                    <Link to="/tenders?category=financial-advisory">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="supplies" className="space-y-6">
              {/* Similar structure for supplies category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Office Supplies</h3>
                    <p className="text-muted-foreground mb-4">
                      Office equipment, furniture, stationery, and general supplies.
                    </p>
                    <Link to="/tenders?category=office-supplies">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Industrial Equipment</h3>
                    <p className="text-muted-foreground mb-4">
                      Industrial machinery, tools, and specialized equipment.
                    </p>
                    <Link to="/tenders?category=industrial-equipment">
                      <Button variant="outline">View Tenders</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
