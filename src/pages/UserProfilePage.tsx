import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form'; // Assuming shadcn form
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, MapPin, CreditCard, ShoppingBag, Edit3, PlusCircle, Trash2, Eye } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Form Schema for Profile
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").optional(),
  avatarUrl: z.string().url("Invalid URL for avatar.").optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Form Schema for Address
const addressFormSchema = z.object({
  id: z.string().optional(), // For editing
  street: z.string().min(3, "Street is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zip: z.string().min(5, "Zip code is required."),
  isDefault: z.boolean().optional(),
});
type AddressFormValues = z.infer<typeof addressFormSchema>;

// Placeholder Data
interface Address extends AddressFormValues { id: string; }
interface PaymentMethod { id: string; type: string; last4: string; expiry: string; isDefault?: boolean; }
interface PastOrder { id: string; date: string; total: number; status: string; items: {name: string, quantity: number}[]; }

const initialUserProfile: ProfileFormValues = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60',
};
const initialAddresses: Address[] = [
  { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', isDefault: true },
  { id: 'addr2', street: '456 Oak Ave', city: 'Otherville', state: 'NY', zip: '10001' },
];
const initialPaymentMethods: PaymentMethod[] = [
  { id: 'pm1', type: 'Visa', last4: '1234', expiry: '12/25', isDefault: true },
  { id: 'pm2', type: 'Mastercard', last4: '5678', expiry: '10/26' },
];
const initialPastOrders: PastOrder[] = [
  { id: 'ORD-789012', date: '2023-10-15', total: 35.50, status: 'Delivered', items: [{name: 'Sushi Combo', quantity: 1}, {name: 'Miso Soup', quantity: 2}] },
  { id: 'ORD-456789', date: '2023-09-20', total: 22.00, status: 'Delivered', items: [{name: 'Pepperoni Pizza', quantity: 1}] },
];


const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState<ProfileFormValues>(initialUserProfile);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(initialPastOrders);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userProfile,
    mode: "onChange",
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { street: '', city: '', state: '', zip: '', isDefault: false },
     mode: "onChange",
  });

  useEffect(() => {
    console.log('UserProfilePage loaded');
    profileForm.reset(userProfile);
  }, [userProfile, profileForm]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    setUserProfile(data);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setIsAddressDialogOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    addressForm.reset({ street: '', city: '', state: '', zip: '', isDefault: false });
    setIsAddressDialogOpen(true);
  };
  
  const onAddressSubmit = (data: AddressFormValues) => {
    if (editingAddress) {
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? { ...addr, ...data } : addr));
      toast({ title: "Address Updated" });
    } else {
      setAddresses([...addresses, { ...data, id: `addr${Date.now()}` }]);
      toast({ title: "Address Added" });
    }
    setIsAddressDialogOpen(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast({ title: "Address Removed" });
  };


  // Placeholder functions for payment methods
  const handleAddPaymentMethod = () => toast({ title: "Feature Coming Soon!", description: "Ability to add payment methods will be available soon." });
  const handleDeletePaymentMethod = (id: string) => toast({ title: "Feature Coming Soon!", description: "Ability to delete payment methods will be available soon." });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center space-x-4">
          <User className="h-10 w-10 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile Form & Avatar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                 <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-orange-400">
                    <AvatarImage src={profileForm.watch('avatarUrl') || userProfile.avatarUrl} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{profileForm.watch('name')}</CardTitle>
                <CardDescription>{profileForm.watch('email')}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={profileForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="Your phone number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="avatarUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://example.com/avatar.png" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Addresses, Payment, Orders */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Addresses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-blue-500"/>Delivery Addresses</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddNewAddress}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {addresses.length > 0 ? addresses.map(addr => (
                    <div key={addr.id} className="p-3 mb-2 border rounded-md flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{addr.street}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                        {addr.isDefault && <span className="text-xs text-green-600 font-medium">(Default)</span>}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr)}><Edit3 className="h-4 w-4" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this address? This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteAddress(addr.id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-500">No addresses saved yet.</p>}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center"><CreditCard className="mr-2 h-5 w-5 text-green-500"/>Payment Methods</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddPaymentMethod}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px]">
                  {paymentMethods.length > 0 ? paymentMethods.map(pm => (
                    <div key={pm.id} className="p-3 mb-2 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{pm.type} ending in {pm.last4}</p>
                        <p className="text-sm text-gray-600">Expires: {pm.expiry}</p>
                        {pm.isDefault && <span className="text-xs text-green-600 font-medium">(Default)</span>}
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeletePaymentMethod(pm.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )) : <p className="text-sm text-gray-500">No payment methods saved yet.</p>}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-purple-500"/>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {pastOrders.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                      {pastOrders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                          <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4">
                                <span>Order ID: {order.id} ({order.date})</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                            <ul className="list-disc pl-5 mt-1 text-sm">
                                {order.items.map(item => <li key={item.name}>{item.name} (x{item.quantity})</li>)}
                            </ul>
                            <div className="mt-3 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </Button>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => toast({title: "Reorder Coming Soon!", description: "This feature will be available shortly."})}>Reorder</Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : <p className="text-sm text-gray-500">No past orders found.</p>}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Address Dialog */}
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your delivery address details.' : 'Enter your new delivery address.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="grid gap-4 py-4">
                <FormField control={addressForm.control} name="street" render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Street</FormLabel>
                    <FormControl><Input className="col-span-3" {...field} /></FormControl>
                    <FormMessage className="col-span-4 text-right text-red-500 text-xs"/>
                  </FormItem>
                )} />
                <FormField control={addressForm.control} name="city" render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">City</FormLabel>
                    <FormControl><Input className="col-span-3" {...field} /></FormControl>
                     <FormMessage className="col-span-4 text-right text-red-500 text-xs"/>
                  </FormItem>
                )} />
                <FormField control={addressForm.control} name="state" render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">State</FormLabel>
                    <FormControl><Input className="col-span-3" {...field} /></FormControl>
                     <FormMessage className="col-span-4 text-right text-red-500 text-xs"/>
                  </FormItem>
                )} />
                <FormField control={addressForm.control} name="zip" render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Zip Code</FormLabel>
                    <FormControl><Input className="col-span-3" {...field} /></FormControl>
                     <FormMessage className="col-span-4 text-right text-red-500 text-xs"/>
                  </FormItem>
                )} />
                 <FormField control={addressForm.control} name="isDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 col-span-4 justify-end">
                    <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" /></FormControl>
                    <FormLabel className="text-sm font-medium">Set as default</FormLabel>
                  </FormItem>
                )} />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">{editingAddress ? 'Save Changes' : 'Add Address'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        FoodDash &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default UserProfilePage;