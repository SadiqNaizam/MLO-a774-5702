import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import MenuItemCard from '@/components/MenuItemCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronDown, ShoppingCart, Star, Utensils } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast";


// Placeholder data structure
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface RestaurantDetails {
  id: string;
  name: string;
  logoUrl: string;
  cuisine: string;
  rating: number;
  menu: MenuItem[];
}

const placeholderRestaurantData: Record<string, RestaurantDetails> = {
  '1': {
    id: '1',
    name: 'Pizza Palace',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3595/3595458.png',
    cuisine: 'Italian, Pizza',
    rating: 4.5,
    menu: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1593504049358-7433045c064a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', category: 'Pizzas' },
      { id: 'm2', name: 'Pepperoni Pizza', description: 'Pizza with spicy pepperoni.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', category: 'Pizzas' },
      { id: 'm3', name: 'Garlic Bread', description: 'Toasted bread with garlic butter.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1604370400031-396397ce2327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', category: 'Appetizers' },
      { id: 'm4', name: 'Coke', description: 'Chilled Coca-Cola.', price: 2.50, category: 'Drinks' },
    ],
  },
  // Add more restaurants if needed
};

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0); // Dummy cart count
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantMenuPage loaded for ID:', restaurantId);
    setLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      if (restaurantId && placeholderRestaurantData[restaurantId]) {
        setRestaurant(placeholderRestaurantData[restaurantId]);
      } else {
        // Handle restaurant not found, e.g., navigate to a 404 page or show message
        console.error("Restaurant not found");
      }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [restaurantId]);

  const handleAddToCart = (item: { id: string | number; name: string; price: number }) => {
    console.log('Added to cart:', item);
    setCartItemCount(prev => prev + 1); // Update dummy cart count
    toast({
        title: "Item Added!",
        description: `${item.name} has been added to your cart.`,
    });
    // Here you would typically update a global cart state
  };

  const groupMenuItemsByCategory = (menu: MenuItem[]) => {
    return menu.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/2 mb-4" /> {/* Breadcrumb */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-white shadow rounded-lg">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-4" /> {/* Category collapsible */}
          <Skeleton className="h-32 w-full mb-4" /> {/* Menu item card */}
          <Skeleton className="h-32 w-full mb-4" /> {/* Menu item card */}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavigationMenu />
        <div className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold">Restaurant not found.</h1>
          <Button onClick={() => navigate('/restaurants')} className="mt-4">Back to Restaurants</Button>
        </div>
      </div>
    );
  }

  const menuByCategories = groupMenuItemsByCategory(restaurant.menu);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/restaurants">Restaurants</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8 p-6 bg-white shadow-lg rounded-xl flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-orange-500">
            <AvatarImage src={restaurant.logoUrl || '/placeholder-logo.svg'} alt={restaurant.name} />
            <AvatarFallback><Utensils className="h-12 w-12" /></AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{restaurant.name}</h1>
            <Label htmlFor="cuisine" className="text-lg text-orange-600">{restaurant.cuisine}</Label>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-gray-700 font-medium">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          <Button onClick={() => navigate('/cart')} className="ml-auto mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600">
            <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({cartItemCount})
          </Button>
        </header>

        <ScrollArea className="h-[calc(100vh-420px)]" type="auto"> {/* Adjust height as needed */}
          {Object.entries(menuByCategories).map(([category, items]) => (
            <Collapsible key={category} defaultOpen className="mb-6 bg-white shadow rounded-lg p-4">
              <CollapsibleTrigger className="flex justify-between items-center w-full py-2 text-xl font-semibold text-gray-700 hover:text-orange-500">
                {category}
                <ChevronDown className="h-5 w-5 transition-transform duration-200 ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </ScrollArea>
      </main>
       <footer className="py-4 text-center text-sm text-gray-500 border-t">
        FoodDash &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;