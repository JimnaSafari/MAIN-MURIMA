import React from 'react';
import Layout from '@/components/Layout';
import AdminRoute from '@/components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Calendar, MapPin, Package, Home, Truck, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

const Admin = () => {
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
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

  const { data: purchases, isLoading: purchasesLoading, error: purchasesError } = useQuery({
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

  const { data: quotes, isLoading: quotesLoading, error: quotesError } = useQuery({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'completed':
      case 'quoted':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage bookings, purchases, and moving quotes</p>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
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
                Moving Quotes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Bookings
                  </CardTitle>
                  <CardDescription>
                    All property bookings and reservations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <LoadingSpinner />
                  ) : bookingsError ? (
                    <ErrorMessage />
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                                </div>
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
                    Marketplace Purchases
                  </CardTitle>
                  <CardDescription>
                    All marketplace item purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasesLoading ? (
                    <LoadingSpinner />
                  ) : purchasesError ? (
                    <ErrorMessage />
                  ) : purchases && purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <Card key={purchase.id} className="border-l-4 border-l-secondary">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(purchase.status)}>
                                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                                </div>
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
                    Moving Quotes
                  </CardTitle>
                  <CardDescription>
                    All moving service quote requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? (
                    <LoadingSpinner />
                  ) : quotesError ? (
                    <ErrorMessage />
                  ) : quotes && quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.map((quote) => (
                        <Card key={quote.id} className="border-l-4 border-l-accent">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(quote.status)}>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                                </div>
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
          </Tabs>
        </div>
      </Layout>
    </AdminRoute>
  );
};

export default Admin;