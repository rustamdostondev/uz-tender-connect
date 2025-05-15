
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">About OpenTender.uz</h1>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="lead text-xl text-center mb-8">
              OpenTender.uz is Uzbekistan's premier tender platform, simplifying the process of connecting businesses with qualified service providers.
            </p>
            
            <div className="bg-primary/5 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p>
                Our mission is to transform how businesses and service providers connect through an efficient, transparent, and user-friendly tender platform. We strive to create opportunities for all, from small businesses to large enterprises, by providing a level playing field for service procurement.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Why Choose OpenTender.uz?</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center mt-1">✓</div>
                <div>
                  <strong>Simplified Process</strong> - Our platform makes creating and responding to tenders straightforward and intuitive.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center mt-1">✓</div>
                <div>
                  <strong>Wide Network</strong> - Connect with a diverse pool of businesses and service providers across Uzbekistan.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center mt-1">✓</div>
                <div>
                  <strong>Time-Saving</strong> - Quickly find the right services or projects without lengthy search processes.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center mt-1">✓</div>
                <div>
                  <strong>Quality Assurance</strong> - Our feedback system helps you identify the most reliable partners.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 rounded-full p-1 h-6 w-6 flex items-center justify-center mt-1">✓</div>
                <div>
                  <strong>AI-Assisted Matching</strong> - Our innovative technology helps identify the best matches for your specific needs.
                </div>
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our History</h2>
            <p>
              OpenTender.uz was founded in 2025 with the vision of modernizing Uzbekistan's tender and procurement processes. Recognizing the challenges businesses face in finding reliable service providers and the difficulties professionals encounter in securing new projects, our team decided to create a solution that addresses these pain points.
            </p>
            <p>
              Since our launch, we have been committed to continuous improvement and innovation, introducing features like AI-assisted tender matching to make the connection between businesses and service providers even more efficient.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Team</h2>
            <p>
              Behind OpenTender.uz is a team of dedicated professionals with extensive experience in technology, business development, and customer service. We are passionate about creating a platform that adds real value to Uzbekistan's business ecosystem and empowers both companies and service providers to thrive.
            </p>
            
            <div className="bg-secondary p-6 rounded-lg mt-10">
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="mb-6">
                Whether you're a business looking for services or a professional looking for opportunities, OpenTender.uz is the platform for you. Join our growing community today and experience a new way of managing tenders and offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button>Create an Account</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
