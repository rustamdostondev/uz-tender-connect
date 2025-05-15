
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HowItWorksPage() {
  return (
    <Layout>
      <div className="container px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How OpenTender.uz Works</h1>
          <p className="text-xl text-muted-foreground">
            Connecting businesses with service providers through a simple and efficient tender system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* For Clients Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-2 border-b">For Businesses</h2>
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-primary/10 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                    <h3 className="font-semibold text-xl">Create a Tender</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Describe your project in detail</h4>
                  <p className="text-muted-foreground mb-4">
                    Specify your requirements, budget, deadline, and any other important details. The more specific you are, the more targeted offers you'll receive.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Set a realistic budget range</li>
                    <li>Define clear project requirements</li>
                    <li>Specify the deadline</li>
                    <li>Upload any relevant documents or images</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-primary/10 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                    <h3 className="font-semibold text-xl">Receive Offers</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Review bids from service providers</h4>
                  <p className="text-muted-foreground mb-4">
                    Once your tender is published, interested service providers will submit their offers. You can review each offer, compare prices, delivery times, and provider qualifications.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Compare prices and delivery timeframes</li>
                    <li>Review provider messages and credentials</li>
                    <li>Assess the quality of each proposal</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-primary/10 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                    <h3 className="font-semibold text-xl">Choose the Best</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Select your preferred provider</h4>
                  <p className="text-muted-foreground mb-4">
                    After reviewing all offers, choose the one that best meets your requirements. You can accept the offer directly through our platform and begin your project.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Accept the best offer</li>
                    <li>Coordinate project details with the provider</li>
                    <li>Track progress and ensure successful completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* For Service Providers Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-2 border-b">For Service Providers</h2>
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-accent p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                    <h3 className="font-semibold text-xl">Browse Tenders</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Find relevant projects</h4>
                  <p className="text-muted-foreground mb-4">
                    Browse through available tenders filtered by category, budget, and deadline. Focus on projects that match your expertise and capabilities.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Use filters to find the most relevant tenders</li>
                    <li>Review project requirements thoroughly</li>
                    <li>Assess if the project matches your skills and availability</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-accent p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                    <h3 className="font-semibold text-xl">Submit Offers</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Create competitive bids</h4>
                  <p className="text-muted-foreground mb-4">
                    Prepare and submit your offer with a competitive price, realistic delivery timeline, and a compelling description of why you're the best fit for the project.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Set a fair price for your services</li>
                    <li>Provide a realistic delivery timeline</li>
                    <li>Highlight your relevant experience and skills</li>
                    <li>Explain your approach to the project</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4">
                  <div className="bg-accent p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                    <h3 className="font-semibold text-xl">Win Projects</h3>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h4 className="font-semibold mb-2">Deliver quality work</h4>
                  <p className="text-muted-foreground mb-4">
                    Once your offer is accepted, deliver high-quality work according to the agreed terms. Building a good reputation on our platform will help you win more projects in the future.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Communicate clearly with the client</li>
                    <li>Deliver work on time and within budget</li>
                    <li>Maintain high quality standards</li>
                    <li>Build a positive reputation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-secondary rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6">Join OpenTender.uz today and start connecting with businesses and service providers.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Create an Account</Button>
              </Link>
              <Link to="/tenders">
                <Button variant="outline" size="lg">Browse Tenders</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
