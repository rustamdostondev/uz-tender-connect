
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { mockTenders, mockCategories } from "@/data/mockData";
import TenderCard from "@/components/tenders/TenderCard";

export default function Index() {
  // Get the latest 3 tenders for our featured section
  const featuredTenders = [...mockTenders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Simplify Your Tender Management with OpenTender.uz
              </h1>
              <p className="text-xl text-muted-foreground">
                Create tenders, receive offers, and find the best service providers all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/tenders">
                  <Button size="lg">Browse Tenders</Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">Create Account</Button>
                </Link>
              </div>
            </div>
            <div className="lg:flex items-center justify-center hidden">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Tender Management" 
                className="rounded-lg shadow-xl max-h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to connect with the right service providers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Tender</h3>
              <p className="text-muted-foreground">
                Define your project requirements, budget, and deadline.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Offers</h3>
              <p className="text-muted-foreground">
                Get competitive bids from qualified service providers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose the Best</h3>
              <p className="text-muted-foreground">
                Review offers, select the best one, and get your project done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tenders */}
      <section className="py-12 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Tenders</h2>
            <Link to="/tenders">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTenders.map((tender) => (
              <TenderCard key={tender.id} {...tender} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Explore tenders across various industries and categories
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockCategories.map((category) => (
              <Link key={category} to={`/tenders?category=${category}`}>
                <div className="bg-white hover:bg-primary/5 border rounded-lg p-6 text-center shadow-sm transition-all">
                  <h3 className="font-semibold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="text-lg opacity-90">
              Join OpenTender.uz today and connect with businesses and service providers across Uzbekistan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Create an Account
                </Button>
              </Link>
              <Link to="/tenders">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Browse Tenders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
