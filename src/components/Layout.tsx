import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-90"
            >
              <Utensils className="h-6 w-6" />
              <span className="text-xl font-bold">Fine Dining</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/menu" className="nav-link">
                Menu
              </Link>
              <Link to="/reservations" className="nav-link">
                Reservations
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
              <Link to="/reservations">
                <Button>Book Now</Button>
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/menu"
                  className="px-4 py-2 hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menu
                </Link>
                <Link
                  to="/reservations"
                  className="px-4 py-2 hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reservations
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2 hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-4">
                  <Link to="/reservations" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="footer">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fine Dining</h3>
              <p className="text-muted-foreground">
                Experience the finest cuisine in an elegant atmosphere.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Mon-Thu: 5:00 PM - 10:00 PM</li>
                <li>Fri-Sat: 5:00 PM - 11:00 PM</li>
                <li>Sun: 5:00 PM - 9:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>123 Restaurant St.</li>
                <li>City, State 12345</li>
                <li>(555) 123-4567</li>
                <li>info@finedining.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="/manage"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Fine Dining. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
