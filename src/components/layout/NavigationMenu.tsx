import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import { Menu, ShoppingCart, User, Utensils } from 'lucide-react';

// Example navigation items
const navItems = [
  { href: '/', label: 'Home', icon: <Utensils className="h-4 w-4 mr-2" /> },
  { href: '/restaurants', label: 'Restaurants', icon: <Utensils className="h-4 w-4 mr-2" /> },
  // Add more navigation links as needed
];

const NavigationMenu: React.FC = () => {
  console.log("Rendering NavigationMenu");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-orange-500">
            <Utensils className="h-7 w-7" />
            <span>FoodDash</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>

          {/* Right side icons (Cart, Profile) - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-500" />
                {/* Add a badge for cart item count here if needed */}
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" aria-label="User Profile">
                <User className="h-6 w-6 text-gray-700 hover:text-orange-500" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 p-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-xl font-bold text-orange-500 mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Utensils className="h-6 w-6" />
                    <span>FoodDash</span>
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <hr/>
                  <Link to="/cart" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                     <ShoppingCart className="h-5 w-5 mr-2" /> Cart
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                     <User className="h-5 w-5 mr-2" /> Profile
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;