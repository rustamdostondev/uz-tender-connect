
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TenderCard from "@/components/tenders/TenderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, loginAsTestUser } = useAuth();
  
  // Fetch recent tenders
  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['recent-tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="relative bg-gradient-to-b from-primary/60 to-primary/30 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="container px-4">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find expert freelancers for your projects
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Create tenders for your projects and receive competitive offers from qualified professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/tenders">
                <Button size="lg" className="text-lg py-6 px-8">
                  Browse Tenders
                </Button>
              </Link>
              {!isAuthenticated ? (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg py-6 px-8"
                  onClick={loginAsTestUser}
                >
                  Login as Test User
                </Button>
              ) : (
                <Link to="/tenders/create">
                  <Button variant="outline" size="lg" className="text-lg py-6 px-8">
                    Create a Tender
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Recent Tenders
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : tenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tenders.map(tender => (
              <TenderCard
                key={tender.id}
                id={tender.id}
                user_id={tender.user_id}
                title={tender.title}
                description={tender.description}
                budget={tender.budget}
                deadline={tender.deadline}
                category={tender.category}
                status={tender.status}
                created_at={tender.created_at}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No tenders available at the moment.
          </p>
        )}

        <div className="text-center mt-12">
          <Link to="/tenders">
            <Button variant="outline">View All Tenders</Button>
          </Link>
        </div>
      </div>

      <div className="bg-muted py-16 md:py-24">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Post a Tender</h3>
              <p className="text-muted-foreground">
                Describe your project requirements, set a budget, and define your deadline.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Receive Offers</h3>
              <p className="text-muted-foreground">
                Qualified professionals will submit their offers tailored to your project.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose & Collaborate</h3>
              <p className="text-muted-foreground">
                Select the best offer and work with your chosen professional.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button>Learn More</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start your project?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses finding the right talent through our platform.
          </p>
          {isAuthenticated ? (
            <Link to="/tenders/create">
              <Button size="lg" className="text-lg py-6 px-8">
                Create a Tender Now
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="text-lg py-6 px-8">
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg py-6 px-8">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
