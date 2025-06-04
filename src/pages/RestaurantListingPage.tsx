import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';

// Placeholder restaurant data
const placeholderRestaurants = [
  { id: '1', name: 'Pizza Palace', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Italian, Pizza', rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Sushi Central', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Japanese, Sushi', rating: 4.8, deliveryTime: '30-40 min' },
  { id: '3', name: 'Burger Hub', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'American, Burgers', rating: 4.2, deliveryTime: '20-30 min' },
  { id: '4', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Indian, Curry', rating: 4.6, deliveryTime: '35-45 min' },
];

const cuisineFilters = ['All', 'Italian', 'Japanese', 'American', 'Indian'];

const RestaurantListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(placeholderRestaurants);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantListingPage loaded');
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
      filterAndSearchRestaurants(searchTerm, activeFilter);
    }, 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterAndSearchRestaurants = (currentSearch: string, currentFilter: string) => {
    let restaurants = placeholderRestaurants;
    if (currentFilter !== 'All') {
      restaurants = restaurants.filter(r => r.cuisine.toLowerCase().includes(currentFilter.toLowerCase()));
    }
    if (currentSearch) {
      restaurants = restaurants.filter(r => r.name.toLowerCase().includes(currentSearch.toLowerCase()) || r.cuisine.toLowerCase().includes(currentSearch.toLowerCase()));
    }
    setFilteredRestaurants(restaurants);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    filterAndSearchRestaurants(newSearchTerm, activeFilter);
  };
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    filterAndSearchRestaurants(searchTerm, filter);
  };

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurants/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Find Your Next Meal</h1>
          <p className="text-lg text-gray-600 mt-2">Discover local restaurants and order food online.</p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          {/* Add filter button for mobile, or expand filters for desktop */}
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 items-center">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-700">Filter by Cuisine:</span>
            {cuisineFilters.map(filter => (
                <Button
                    key={filter}
                    variant={activeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterClick(filter)}
                    className={activeFilter === filter ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
                >
                    {filter}
                </Button>
            ))}
        </div>


        <ScrollArea className="h-[calc(100vh-300px)]"> {/* Adjust height as needed */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredRestaurants.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard
                        key={restaurant.id}
                        id={restaurant.id}
                        name={restaurant.name}
                        imageUrl={restaurant.imageUrl}
                        cuisine={restaurant.cuisine}
                        rating={restaurant.rating}
                        deliveryTime={restaurant.deliveryTime}
                        onClick={handleRestaurantClick}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-xl col-span-full">No restaurants found matching your criteria.</p>
            )
          )}
        </ScrollArea>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        FoodDash &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default RestaurantListingPage;