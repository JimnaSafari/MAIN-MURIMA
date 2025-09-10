import React from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserQuotes } from '@/hooks/useQuotes';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Calendar, MapPin, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const QuotesPage = () => {
  const { data: quotes, isLoading, error, refetch } = useUserQuotes();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'quoted':
      case 'confirmed':
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
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Moving Quotes</h1>
            <p className="text-muted-foreground">Track your moving service quotes and requests</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Moving Quotes
              </CardTitle>
              <CardDescription>
                View and manage your moving service quote requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage onRetry={() => refetch()} />
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
                              {quote.inventory && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Inventory: {quote.inventory}
                                </div>
                              )}
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
                  <p className="text-sm text-muted-foreground">Your moving service quote requests will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default QuotesPage;