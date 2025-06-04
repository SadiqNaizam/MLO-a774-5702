import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Trash2, Plus, Minus, ShoppingCart, Tag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Placeholder cart data (in a real app, this would come from state/context)
const initialCartItems: CartItem[] = [
  { id: 'm1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1593504049358-7433045c064a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60' },
  { id: 'm3', name: 'Garlic Bread', price: 5.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1604370400031-396397ce2327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
    // Load cart items from localStorage or global state if implemented
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
        // Trigger remove confirmation or set to 1 based on preference
        // For now, let's just prevent going below 1 directly
        return;
    }
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({ title: "Item Removed", description: "The item has been removed from your cart."});
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.1; // Example 10% tax
  const total = subtotal + taxes - discount;

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1); // 10% discount
      toast({ title: "Promo Code Applied!", description: "You got a 10% discount."});
    } else {
      setDiscount(0);
      toast({ variant: "destructive", title: "Invalid Promo Code", description: "The promo code you entered is not valid."});
    }
  };

  const handleCheckout = () => {
    if(cartItems.length === 0) {
        toast({ variant: "destructive", title: "Empty Cart", description: "Please add items to your cart before proceeding."});
        return;
    }
    console.log('Proceeding to checkout with items:', cartItems);
    // Navigate to a checkout page or trigger a checkout modal/process
    // For now, let's simulate an order ID and navigate to confirmation.
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* Example: Could add restaurant name here if cart is restaurant-specific */}
            <BreadcrumbItem>
              <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center text-gray-800">
              <ShoppingCart className="mr-3 h-8 w-8 text-orange-500" /> Your Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl text-gray-600">Your cart is empty.</p>
                <Button onClick={() => navigate('/restaurants')} className="mt-4 bg-orange-500 hover:bg-orange-600">Start Shopping</Button>
              </div>
            ) : (
              <div className="lg:flex lg:gap-8">
                <div className="lg:w-2/3">
                  <ScrollArea className="h-[400px] pr-2"> {/* Adjust height as needed */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] hidden md:table-cell">Item</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Remove</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="hidden md:table-cell">
                                <img src={item.imageUrl || `https://via.placeholder.com/64?text=${item.name.charAt(0)}`} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <=1}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input type="number" value={item.quantity} readOnly className="w-12 text-center" />
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will remove {item.name} from your cart.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeItem(item.id)} className="bg-red-500 hover:bg-red-600">Remove</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                <div className="lg:w-1/3 mt-8 lg:mt-0">
                  <Card className="bg-gray-50 p-6 rounded-lg">
                    <CardTitle className="text-xl mb-4">Order Summary</CardTitle>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Taxes (10%):</span><span>${taxes.toFixed(2)}</span></div>
                      {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-${discount.toFixed(2)}</span></div>}
                      <hr className="my-2"/>
                      <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>
                    </div>
                    <div className="mt-6 mb-4">
                      <Label htmlFor="promo" className="block mb-1 font-medium">Promo Code</Label>
                      <div className="flex gap-2">
                        <Input id="promo" type="text" placeholder="Enter code (e.g. SAVE10)" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                        <Button onClick={handleApplyPromoCode} variant="outline" className="whitespace-nowrap">
                            <Tag className="mr-2 h-4 w-4"/> Apply
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3">
                      Proceed to Checkout
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        FoodDash &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default CartPage;