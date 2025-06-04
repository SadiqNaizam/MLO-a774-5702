import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Page Components
import RestaurantListingPage from "./pages/RestaurantListingPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CartPage from "./pages/CartPage";
import OrderConfirmationAndTrackingPage from "./pages/OrderConfirmationAndTrackingPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner /> {/* Use the renamed Sonner component */}
      <BrowserRouter>
        <Routes>
          {/* Set RestaurantListingPage as the index route for '/' */}
          <Route path="/" element={<RestaurantListingPage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route path="/restaurants/:restaurantId" element={<RestaurantMenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationAndTrackingPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;