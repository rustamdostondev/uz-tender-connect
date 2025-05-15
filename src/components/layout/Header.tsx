
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isLoggedIn = false; // Will be replaced with actual auth state

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="grid gap-4 py-4">
                <Link to="/" className="text-lg font-bold">OpenTender.uz</Link>
                <nav className="grid gap-2 mt-4">
                  <Link to="/tenders" className="text-sm px-3 py-2 rounded-md hover:bg-secondary">
                    Browse Tenders
                  </Link>
                  <Link to="/how-it-works" className="text-sm px-3 py-2 rounded-md hover:bg-secondary">
                    How It Works
                  </Link>
                  <Link to="/about" className="text-sm px-3 py-2 rounded-md hover:bg-secondary">
                    About
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-bold text-xl md:text-2xl text-primary">
            OpenTender.uz
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/tenders" className="text-sm font-medium hover:text-primary">
            Browse Tenders
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isSearchVisible ? (
            <div className="flex items-center border rounded-md overflow-hidden pr-2">
              <Input 
                type="search" 
                placeholder="Search tenders..." 
                className="h-9 w-[150px] md:w-[200px] border-none focus-visible:ring-0" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchVisible(false)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchVisible(true)}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
