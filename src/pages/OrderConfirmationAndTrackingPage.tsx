import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import OrderStatusVisualizer, { defaultOrderStatuses, OrderStatusStep } from '@/components/OrderStatusVisualizer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { CheckCircle, ShoppingBag, Home, ListOrdered } from 'lucide-react';

// Placeholder order details
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
interface OrderDetails {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  estimatedDelivery: string;
  deliveryAddress: string;
  currentStatusKey: string;
}

const placeholderOrder: OrderDetails = {
  orderId: 'ORD-123456',
  items: [
    { id: 'm1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { id: 'm3', name: 'Garlic Bread', quantity: 2, price: 5.99 },
  ],
  totalAmount: 24.97,
  estimatedDelivery: '30-40 minutes',
  deliveryAddress: '123 Main St, Anytown, USA',
  currentStatusKey: 'confirmed', // Initial status
};


const OrderConfirmationAndTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('OrderConfirmationAndTrackingPage loaded for Order ID:', orderId);
    setLoading(true);
    // Simulate fetching order details
    const timer = setTimeout(() => {
      // In a real app, fetch order details using orderId
      // For this example, we'll use placeholderOrder and just update its ID and a status.
      const fetchedOrder = { ...placeholderOrder, orderId: orderId || placeholderOrder.orderId };
      
      // Simulate status progression for demonstration
      // This would typically come from a backend or WebSocket updates
      const statuses = defaultOrderStatuses.map(s => s.key);
      let currentStatusIndex = statuses.indexOf(fetchedOrder.currentStatusKey);

      if (sessionStorage.getItem(`orderStatus_${orderId}`)) {
        fetchedOrder.currentStatusKey = sessionStorage.getItem(`orderStatus_${orderId}`)!;
      } else {
         sessionStorage.setItem(`orderStatus_${orderId}`, fetchedOrder.currentStatusKey);
      }


      setOrder(fetchedOrder);
      setLoading(false);

      // Simulate status updates if not delivered or cancelled
      if (fetchedOrder.currentStatusKey !== 'delivered' && fetchedOrder.currentStatusKey !== 'cancelled') {
        const interval = setInterval(() => {
          setOrder(prevOrder => {
            if (!prevOrder) return null;
            let currentIndex = statuses.indexOf(prevOrder.currentStatusKey);
            if (currentIndex < statuses.length - 1) {
              const nextStatus = statuses[currentIndex + 1];
              sessionStorage.setItem(`orderStatus_${orderId}`, nextStatus);
              return { ...prevOrder, currentStatusKey: nextStatus };
            }
            clearInterval(interval);
            return prevOrder;
          });
        }, 15000); // Update status every 15 seconds
         return () => clearInterval(interval);
      }


    }, 1000);
     return () => clearTimeout(timer);
  }, [orderId]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <NavigationMenu/>
            <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <Card className="w-full max-w-2xl p-8 text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 animate-pulse mb-4" />
                    <p className="text-xl text-gray-600">Loading your order details...</p>
                </Card>
            </div>
        </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <NavigationMenu />
        <div className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold">Order not found.</h1>
          <Button onClick={() => navigate('/')} className="mt-4">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-green-500 text-white text-center p-6 rounded-t-lg">
            <CheckCircle className="mx-auto h-16 w-16 mb-2" />
            <CardTitle className="text-3xl font-bold">Order Confirmed!</CardTitle>
            <CardDescription className="text-green-100 text-lg">
              Thank you for your order. Your food is on its way!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <Label htmlFor="orderId" className="text-sm font-medium text-gray-500">Order ID</Label>
              <p id="orderId" className="text-xl font-semibold text-orange-600">{order.orderId}</p>
            </div>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Order Status</h3>
              <OrderStatusVisualizer currentStatusKey={order.currentStatusKey} />
            </section>
            
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-700">Estimated Delivery Time:</p>
                        <p className="text-gray-600">{order.estimatedDelivery}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-700">Delivery Address:</p>
                        <p className="text-gray-600">{order.deliveryAddress}</p>
                    </div>
                </div>
            </section>


            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium hover:text-orange-500">View Order Summary</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 my-2">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <hr/>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total Amount:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t">
            <Button variant="outline" onClick={() => navigate('/restaurants')} className="w-full sm:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" /> Order More Food
            </Button>
            <Button onClick={() => navigate('/profile')} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
              <ListOrdered className="mr-2 h-4 w-4" /> View All Orders
            </Button>
          </CardFooter>
        </Card>
      </main>
       <footer className="py-4 text-center text-sm text-gray-500 border-t">
        FoodDash &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default OrderConfirmationAndTrackingPage;