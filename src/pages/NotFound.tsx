
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center px-4 py-16 md:py-32">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
            <Link to="/tenders">
              <Button variant="outline">Browse Tenders</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
