import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AdminRoute from '@/components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { toast } from 'sonner';
import { 
  Calendar, MapPin, Package, Home, Truck, User, Mail, Phone, 
  Plus, Edit, Trash2, Check, X, ShieldCheck, UserCog, BarChart3 
} from 'lucide-react';
import { format } from 'date-fns';
import ListingForm from '@/components/ListingForm';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch all data for admin overview
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          properties(title, image, type, location, price, price_type)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["admin_purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          marketplace_items(title, image, category)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["admin_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mover_quotes")
        .select(`
          *,
          moving_services(name, image, location, price_range)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: properties } = useQuery({
    queryKey: ["admin_properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: marketplaceItems } = useQuery({
    queryKey: ["admin_marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: movingServices } = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moving_services")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Update status mutations
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_bookings"] });
      toast.success("Booking status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  const updatePurchaseStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("purchases")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_purchases"] });
      toast.success("Purchase status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update purchase status");
    },
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status, quote_amount }: { id: string; status: string; quote_amount?: number }) => {
      const updateData: any = { status };
      if (quote_amount !== undefined) {
        updateData.quote_amount = quote_amount;
      }
      
      const { error } = await supabase
        .from("mover_quotes")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
      toast.success("Quote updated successfully");
    },
    onError: () => {
      toast.error("Failed to update quote");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
      case 'completed':
      case 'quoted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const QuickActions = ({ type, id, currentStatus }: { type: 'booking' | 'purchase' | 'quote'; id: string; currentStatus: string }) => {
    const [quoteAmount, setQuoteAmount] = useState('');

    const handleStatusUpdate = (newStatus: string) => {
      if (type === 'booking') {
        updateBookingStatus.mutate({ id, status: newStatus });
      } else if (type === 'purchase') {
        updatePurchaseStatus.mutate({ id, status: newStatus });
      } else if (type === 'quote') {
        const amount = newStatus === 'quoted' ? parseFloat(quoteAmount) : undefined;
        updateQuoteStatus.mutate({ id, status: newStatus, quote_amount: amount });
      }
    };

    return (
      <div className="flex gap-2 flex-wrap">
        {currentStatus === 'pending' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate('confirmed')}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Check className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate('cancelled')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </>
        )}
        {type === 'quote' && currentStatus === 'confirmed' && (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Quote amount"
              type="number"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              className="w-24"
            />
            <Button
              size="sm"
              onClick={() => handleStatusUpdate('quoted')}
              disabled={!quoteAmount}
            >
              Quote
            </Button>
          </div>
        )}
        {currentStatus === 'confirmed' && type !== 'quote' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate('completed')}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Complete
          </Button>
        )}
      </div>
    );
  };

  const OverviewCard = ({ title, count, icon: Icon, description }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count || 0}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Complete administrative control and management</p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Purchases
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Quotes
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Listings
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OverviewCard
                  title="Total Bookings"
                  count={bookings?.length}
                  icon={Home}
                  description="Property reservations"
                />
                <OverviewCard
                  title="Total Purchases"
                  count={purchases?.length}
                  icon={Package}
                  description="Marketplace sales"
                />
                <OverviewCard
                  title="Moving Quotes"
                  count={quotes?.length}
                  icon={Truck}
                  description="Service requests"
                />
                <OverviewCard
                  title="Total Properties"
                  count={properties?.length}
                  icon={MapPin}
                  description="Listed properties"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest bookings and purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings?.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{booking.guest_name}</p>
                            <p className="text-sm text-muted-foreground">Booked {booking.properties?.title}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Create new listings and manage content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <ListingForm type="property" />
                      <ListingForm type="marketplace" />
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Moving Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Bookings Management
                  </CardTitle>
                  <CardDescription>
                    Manage all property bookings and reservations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <LoadingSpinner />
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {booking.properties?.image && (
                                  <img
                                    src={booking.properties.image}
                                    alt={booking.properties.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {booking.properties?.title || 'Property'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <MapPin className="h-4 w-4" />
                                    {booking.properties?.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(booking.booking_date), 'PPP')}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {booking.guest_name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {booking.guest_email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {booking.guest_phone}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                                </div>
                                <QuickActions 
                                  type="booking" 
                                  id={booking.id} 
                                  currentStatus={booking.status} 
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Marketplace Purchases Management
                  </CardTitle>
                  <CardDescription>
                    Manage all marketplace purchases and orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasesLoading ? (
                    <LoadingSpinner />
                  ) : purchases && purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <Card key={purchase.id} className="border-l-4 border-l-secondary">
                          <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {purchase.marketplace_items?.image && (
                                  <img
                                    src={purchase.marketplace_items.image}
                                    alt={purchase.marketplace_items.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {purchase.marketplace_items?.title || 'Item'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Package className="h-4 w-4" />
                                    {purchase.marketplace_items?.category}
                                  </div>
                                  <div className="text-lg font-bold text-primary mb-2">
                                    KSh {purchase.purchase_price.toLocaleString()}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {purchase.buyer_name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {purchase.buyer_email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {purchase.buyer_phone}
                                    </div>
                                    {purchase.delivery_address && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {purchase.delivery_address}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                <Badge className={getStatusColor(purchase.status)}>
                                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                                </div>
                                <QuickActions 
                                  type="purchase" 
                                  id={purchase.id} 
                                  currentStatus={purchase.status} 
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No purchases yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Moving Quotes Management
                  </CardTitle>
                  <CardDescription>
                    Manage all moving service quotes and requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? (
                    <LoadingSpinner />
                  ) : quotes && quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.map((quote) => (
                        <Card key={quote.id} className="border-l-4 border-l-accent">
                          <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {quote.moving_services?.image && (
                                  <img
                                    src={quote.moving_services.image}
                                    alt={quote.moving_services.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {quote.moving_services?.name || 'Moving Service'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(quote.moving_date), 'PPP')}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {quote.client_name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {quote.client_email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {quote.client_phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {quote.pickup_location} → {quote.delivery_location}
                                    </div>
                                    {quote.quote_amount && (
                                      <div className="text-lg font-bold text-primary">
                                        KSh {quote.quote_amount.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                <Badge className={getStatusColor(quote.status)}>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                                </div>
                                <QuickActions 
                                  type="quote" 
                                  id={quote.id} 
                                  currentStatus={quote.status} 
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No quotes yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Property Listing</CardTitle>
                    <CardDescription>Add new properties to the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ListingForm type="property" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Create Marketplace Listing</CardTitle>
                    <CardDescription>Add new items to the marketplace</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ListingForm type="marketplace" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage all listings and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium">{properties?.length || 0} Properties</p>
                      <p className="text-sm text-muted-foreground">Active listings</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Package className="h-8 w-8 mx-auto mb-2 text-secondary" />
                      <p className="font-medium">{marketplaceItems?.length || 0} Marketplace Items</p>
                      <p className="text-sm text-muted-foreground">Active listings</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Truck className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="font-medium">{movingServices?.length || 0} Moving Services</p>
                      <p className="text-sm text-muted-foreground">Active services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User management features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AdminRoute>
  );
};

export default AdminDashboard;