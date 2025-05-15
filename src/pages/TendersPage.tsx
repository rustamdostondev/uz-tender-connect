
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TendersList from "@/components/tenders/TendersList";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

export default function TendersPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  
  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {category ? `${category} Tenders` : "Browse Tenders"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Find the perfect tender for your services
            </p>
          </div>
          <Button>Create Tender</Button>
        </div>
        
        <TendersList showFilters={true} />
      </div>
    </Layout>
  );
}
