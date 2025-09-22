import React from 'react';
import Layout from '@/components/Layout';
import AdminRoute from '@/components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Calendar, MapPin, Package, Home, Truck, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useDjangoAdminDashboard } from '@/hooks/useDjangoDashboard';

const Admin = () => {
  const { data: adminData, isLoading, error, refetch } = useDjangoAdminDashboard();

  // Extract data from admin dashboard
  const bookings = adminData?.bookings || [];
  const purchases = adminData?.purchases || [];
  const quotes = adminData?.quotes || [];
  const properties = adminData?.properties || [];
  const marketplaceItems = adminData?.marketplace_items || [];
  const movingServices = adminData?.moving_services || [];

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

  if (isLoading) {
    return (
      <AdminRoute>
        <Layout>
          <LoadingSpinner className="py-20" />
        </Layout>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <Layout>
          <ErrorMessage
            message="Failed to load admin dashboard data. Please try again."
            onRetry={() => refetch()}
          />
        </Layout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={() => refetch()}>Refresh Data</Button>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Purchases ({purchases.length})
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Quotes ({quotes.length})
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties ({properties.length})
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Marketplace ({marketplaceItems.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Services ({movingServices.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Property Bookings
                  </CardTitle>
                  <CardDescription>
                    Manage property booking requests and reservations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <Card key={booking.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                  {booking.property?.title || 'Property Booking'}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {booking.property?.location}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(booking.booking_date), 'PPP')}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  {booking.guest_name}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {booking.guest_email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  {booking.guest_phone}
                                </div>
                              </div>
                              <div className="text-right space-y-2">
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
                    <div className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Marketplace Purchases
                  </CardTitle>
                  <CardDescription>
                    View and manage marketplace item purchases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.map((purchase: any) => (
                        <Card key={purchase.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                  {purchase.item?.title || 'Marketplace Purchase'}
                                </h3>
                                <div className="text-2xl font-bold text-green-600">
                                  KSh {purchase.purchase_price?.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  {purchase.buyer_name}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {purchase.buyer_email}
                                </div>
                                {purchase.delivery_address && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {purchase.delivery_address}
                                  </div>
                                )}
                              </div>
                              <div className="text-right space-y-2">
                                <Badge className={getStatusColor(purchase.status || 'pending')}>
                                  {(purchase.status || 'pending').charAt(0).toUpperCase() + (purchase.status || 'pending').slice(1)}
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
                    <div className="text-center py-8 text-muted-foreground">
                      No purchases found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Moving Quotes
                  </CardTitle>
                  <CardDescription>
                    Manage moving service quote requests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.map((quote: any) => (
                        <Card key={quote.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                  {quote.service?.name || 'Moving Quote'}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {quote.pickup_location} → {quote.delivery_location}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(quote.moving_date), 'PPP')}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  {quote.client_name}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {quote.client_email}
                                </div>
                                {quote.inventory && (
                                  <div className="text-sm text-muted-foreground">
                                    Inventory: {quote.inventory}
                                  </div>
                                )}
                              </div>
                              <div className="text-right space-y-2">
                                <Badge className={getStatusColor(quote.status || 'pending')}>
                                  {(quote.status || 'pending').charAt(0).toUpperCase() + (quote.status || 'pending').slice(1)}
                                </Badge>
                                {quote.quote_amount && (
                                  <div className="text-xl font-bold text-orange-600">
                                    KSh {quote.quote_amount.toLocaleString()}
                                  </div>
                                )}
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
                    <div className="text-center py-8 text-muted-foreground">
                      No quotes found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-6 w-6" />
                    Properties
                  </CardTitle>
                  <CardDescription>
                    View all properties in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {properties.map((property: any) => (
                        <Card key={property.id}>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-muted-foreground">{property.location}</p>
                            <p className="text-lg font-bold text-primary">
                              KSh {property.price?.toLocaleString()}
                            </p>
                            <Badge variant="secondary">{property.type}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No properties found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Marketplace Items
                  </CardTitle>
                  <CardDescription>
                    View all marketplace items.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {marketplaceItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {marketplaceItems.map((item: any) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-muted-foreground">{item.location}</p>
                            <p className="text-lg font-bold text-primary">
                              KSh {item.price?.toLocaleString()}
                            </p>
                            <Badge variant="secondary">{item.category}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No marketplace items found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Moving Services
                  </CardTitle>
                  <CardDescription>
                    View all moving service providers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {movingServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {movingServices.map((service: any) => (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-muted-foreground">{service.location}</p>
                            <p className="text-sm">{service.description}</p>
                            <Badge variant={service.verified ? "default" : "secondary"}>
                              {service.verified ? "Verified" : "Unverified"}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No moving services found
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