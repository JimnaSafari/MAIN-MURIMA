import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserBookings } from '@/hooks/useBookings';
import { useUserPurchases } from '@/hooks/usePurchases';
import { useUserQuotes } from '@/hooks/useQuotes';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import ListingForm from '@/components/ListingForm';
import { Calendar, MapPin, Package, Home, Star, Clock, CheckCircle, XCircle, Truck, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useUserBookings();
  const { data: purchases, isLoading: purchasesLoading, error: purchasesError, refetch: refetchPurchases } = useUserPurchases();
  const { data: quotes, isLoading: quotesLoading, error: quotesError, refetch: refetchQuotes } = useUserQuotes();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">Track your bookings and purchases</p>
            </div>
            <div className="flex gap-2">
              <ListingForm type="property" />
              <ListingForm type="marketplace" />
            </div>
          </div>

          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                My Listings
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Purchases
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Moving Quotes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Create Property Listing
                    </CardTitle>
                    <CardDescription>
                      List your property for rent or sale
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ListingForm type="property" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Create Marketplace Listing
                    </CardTitle>
                    <CardDescription>
                      Sell items in the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ListingForm type="marketplace" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Bookings
                  </CardTitle>
                  <CardDescription>
                    View and manage your rental and Airbnb bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <LoadingSpinner />
                  ) : bookingsError ? (
                    <ErrorMessage onRetry={() => refetchBookings()} />
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {booking.property?.image && (
                                  <img
                                    src={booking.property.image}
                                    alt={booking.property.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {booking.property?.title || 'Property'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <MapPin className="h-4 w-4" />
                                    {booking.property?.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(booking.booking_date), 'PPP')}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Guest: {booking.guest_name} • {booking.guest_email}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(booking.status)}
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </div>
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  Booked {format(new Date(booking.created_at), 'MMM dd, yyyy')}
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
                      <p className="text-sm text-muted-foreground">Your property bookings will appear here</p>
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
                    Track your marketplace item purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasesLoading ? (
                    <LoadingSpinner />
                  ) : purchasesError ? (
                    <ErrorMessage onRetry={() => refetchPurchases()} />
                  ) : purchases && purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <Card key={purchase.id} className="border-l-4 border-l-secondary">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {purchase.item?.image && (
                                  <img
                                    src={purchase.item.image}
                                    alt={purchase.item.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {purchase.item?.title || 'Item'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Package className="h-4 w-4" />
                                    {purchase.item?.category}
                                  </div>
                                  <div className="text-lg font-bold text-primary mb-2">
                                    KSh {purchase.purchase_price.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Buyer: {purchase.buyer_name} • {purchase.buyer_email}
                                  </div>
                                  {purchase.delivery_address && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      Delivery: {purchase.delivery_address}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(purchase.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(purchase.status)}
                                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                  </div>
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  Purchased {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
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
                      <p className="text-sm text-muted-foreground">Your marketplace purchases will appear here</p>
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
                    Track your moving service quote requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? (
                    <LoadingSpinner />
                  ) : quotesError ? (
                    <ErrorMessage onRetry={() => refetchQuotes()} />
                  ) : quotes && quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.map((quote) => (
                        <Card key={quote.id} className="border-l-4 border-l-accent">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                {quote.service?.image && (
                                  <img
                                    src={quote.service.image}
                                    alt={quote.service.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {quote.service?.name || 'Moving Service'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <MapPin className="h-4 w-4" />
                                    {quote.pickup_location} → {quote.delivery_location}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(quote.moving_date), 'PPP')}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Client: {quote.client_name} • {quote.client_email}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(quote.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(quote.status)}
                                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                  </div>
                                </Badge>
                                {quote.quote_amount && (
                                  <div className="text-lg font-bold text-primary">
                                    KSh {quote.quote_amount.toLocaleString()}
                                  </div>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  Requested {format(new Date(quote.created_at), 'MMM dd, yyyy')}
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
                      <p className="text-sm text-muted-foreground">Your moving service quotes will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;