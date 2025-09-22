import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDjangoDashboard } from '@/hooks/useDjangoDashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import ListingForm from '@/components/ListingForm';
import { Calendar, MapPin, Package, Home, Star, Clock, CheckCircle, XCircle, Truck, Plus, TrendingUp, Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDjangoDashboard();

  // Auto-refresh dashboard data every 30 seconds to show booking status updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchDashboard();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetchDashboard]);

  // Extract data from Django dashboard response
  const bookings = dashboardData?.bookings || [];
  const purchases = dashboardData?.purchases || [];
  const quotes = dashboardData?.quotes || [];
  const marketplaceItems = dashboardData?.marketplace_items || [];
  const userProperties = dashboardData?.user_properties || [];
  const stats = dashboardData?.stats || {};

  const bookingsLoading = dashboardLoading;
  const purchasesLoading = dashboardLoading;
  const quotesLoading = dashboardLoading;
  const bookingsError = dashboardError;
  const purchasesError = dashboardError;
  const quotesError = dashboardError;

  const refetchBookings = refetchDashboard;
  const refetchPurchases = refetchDashboard;
  const refetchQuotes = refetchDashboard;



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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <motion.div
              className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Welcome back! 👋
                  </h1>
                  <p className="text-xl text-blue-100 mb-6">
                    Here's your activity overview and latest updates
                  </p>
                </motion.div>

                {/* Quick Stats in Hero */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Active Bookings</p>
                        <p className="text-2xl font-bold text-white">{stats.total_bookings || 0}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Moving Quotes</p>
                        <p className="text-2xl font-bold text-white">{stats.total_quotes || 0}</p>
                      </div>
                      <Truck className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Market Items</p>
                        <p className="text-2xl font-bold text-white">{stats.total_marketplace_items || 0}</p>
                      </div>
                      <Package className="h-8 w-8 text-indigo-200" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Statistics Overview */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Bookings</CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">{stats.total_bookings || 0}</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Property reservations</p>
                  <div className="mt-3 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.total_bookings || 0) * 10, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Moving Quotes</CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">{stats.total_quotes || 0}</div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Service requests</p>
                  <div className="mt-3 h-1 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.total_quotes || 0) * 15, 100)}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Market Items</CardTitle>
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">{stats.total_marketplace_items || 0}</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Listed items</p>
                  <div className="mt-3 h-1 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.total_marketplace_items || 0) * 8, 100)}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>


          </motion.div>



          {/* Charts Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Activity Overview
                </CardTitle>
                <CardDescription className="text-base">Visual breakdown of your dashboard metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={[
                        { name: 'Bookings', value: stats.total_bookings || 0, color: '#3b82f6', bgColor: '#dbeafe' },
                        { name: 'Quotes', value: stats.total_quotes || 0, color: '#8b5cf6', bgColor: '#ede9fe' },
                        { name: 'Market Items', value: stats.total_marketplace_items || 0, color: '#10b981', bgColor: '#d1fae5' }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                        </linearGradient>
                        <linearGradient id="quotesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.9}/>
                        </linearGradient>
                        <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                        </linearGradient>
                        <linearGradient id="propertiesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.9}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          backdropFilter: 'blur(10px)'
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        fill="url(#bookingsGradient)"
                        animationBegin={0}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_bookings || 0}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Bookings</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total_quotes || 0}</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Quotes</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.total_marketplace_items || 0}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Market Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-base">Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-blue-500 rounded-full shadow-sm">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Booking Update</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 truncate">
                          Your booking for <span className="font-medium">{booking.property?.title}</span> is now <span className="font-medium capitalize">{booking.status}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {format(new Date(booking.created_at), 'MMM dd')}
                        </span>
                        <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"></div>
                      </div>
                    </motion.div>
                  ))}

                  {purchases.slice(0, 2).map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index + 3) * 0.1 }}
                      className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/50 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-emerald-500 rounded-full shadow-sm">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">Purchase Completed</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 truncate">
                          You purchased <span className="font-medium">{purchase.item?.title}</span> for <span className="font-medium">KSh {purchase.purchase_price.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {format(new Date(purchase.created_at), 'MMM dd')}
                        </span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mt-1"></div>
                      </div>
                    </motion.div>
                  ))}

                  {quotes.slice(0, 2).map((quote, index) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index + 5) * 0.1 }}
                      className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/50 rounded-xl border border-amber-200/50 dark:border-amber-800/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-amber-500 rounded-full shadow-sm">
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-amber-900 dark:text-amber-100">Quote Requested</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 truncate">
                          Moving from <span className="font-medium">{quote.pickup_location}</span> to <span className="font-medium">{quote.delivery_location}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {format(new Date(quote.created_at), 'MMM dd')}
                        </span>
                        <div className="w-2 h-2 bg-amber-400 rounded-full mx-auto mt-1"></div>
                      </div>
                    </motion.div>
                  ))}

                  {(!bookings.length && !purchases.length && !quotes.length) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
                        <div className="relative p-6 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                          <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-muted-foreground mt-6 mb-2">No Recent Activity</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Your recent actions and updates will appear here. Start by booking a property or requesting a moving quote!
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-muted rounded-lg p-1">
              <TabsTrigger value="bookings" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                <Calendar className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                <Package className="h-4 w-4" />
                My Purchases
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                <Truck className="h-4 w-4" />
                Moving Quotes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                          <Home className="h-6 w-6 text-primary" />
                          Property Bookings
                        </CardTitle>
                        <CardDescription>
                          View and manage your rental and Airbnb bookings.
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => refetchBookings()}
                        variant="outline"
                        size="sm"
                        disabled={bookingsLoading}
                        className="flex items-center gap-2"
                      >
                        <Activity className={`h-4 w-4 ${bookingsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {bookingsLoading ? (
                      <LoadingSpinner />
                    ) : bookingsError ? (
                      <ErrorMessage onRetry={() => refetchBookings()} />
                    ) : bookings && bookings.length > 0 ? (
                      <div className="space-y-6">
                        {bookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="border-l-8 border-l-primary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                              <CardContent className="p-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                  <div className="flex items-start gap-4 flex-grow">
                                    {booking.property?.image && (
                                      <img
                                        src={booking.property.image}
                                        alt={booking.property.title}
                                        className="w-24 h-24 rounded-lg object-cover shadow-sm"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h3 className="font-bold text-xl text-foreground mb-1">
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
                                    <Badge className={`${getStatusColor(booking.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                                      <div className="flex items-center gap-1">
                                        {getStatusIcon(booking.status)}
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                      </div>
                                    </Badge>
                                    {booking.status === 'pending' && (
                                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                        Waiting for admin approval
                                      </div>
                                    )}
                                    {booking.status === 'confirmed' && (
                                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        ✓ Approved - Check your email
                                      </div>
                                    )}
                                    {booking.status === 'cancelled' && (
                                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        ✗ Rejected - Check your email
                                      </div>
                                    )}
                                    <div className="text-sm text-muted-foreground">
                                      Booked {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-2 bg-black text-white hover:bg-gray-800 border-black">Book Now</Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/40 rounded-lg">
                        <Home className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">No bookings yet</p>
                        <p className="text-sm text-muted-foreground">Your property bookings will appear here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                    <Package className="h-6 w-6 text-secondary" />
                    Marketplace Purchases
                  </CardTitle>
                  <CardDescription>
                    Track your marketplace item purchases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {purchasesLoading ? (
                    <LoadingSpinner />
                  ) : purchasesError ? (
                    <ErrorMessage onRetry={() => refetchPurchases()} />
                  ) : purchases && purchases.length > 0 ? (
                    <div className="space-y-6">
                      {purchases.map((purchase) => (
                        <Card key={purchase.id} className="border-l-8 border-l-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                              <div className="flex items-start gap-4 flex-grow">
                                {purchase.item?.image && (
                                  <img
                                    src={purchase.item.image}
                                    alt={purchase.item.title}
                                    className="w-24 h-24 rounded-lg object-cover shadow-sm"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-foreground mb-1">
                                    {purchase.item?.title || 'Item'}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                    <Package className="h-4 w-4" />
                                    {purchase.item?.category}
                                  </div>
                                  <div className="text-xl font-extrabold text-primary mb-2">
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
                                <Badge className={`${getStatusColor(purchase.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(purchase.status)}
                                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                  </div>
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  Purchased {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                                </div>
                                <Button variant="outline" size="sm" className="mt-2 bg-black text-white hover:bg-gray-800 border-black">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/40 rounded-lg">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">No purchases yet</p>
                      <p className="text-sm text-muted-foreground">Your marketplace purchases will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                    <Truck className="h-6 w-6 text-accent" />
                    Moving Quotes
                  </CardTitle>
                  <CardDescription>
                    Track your moving service quote requests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {quotesLoading ? (
                    <LoadingSpinner />
                  ) : quotesError ? (
                    <ErrorMessage onRetry={() => refetchQuotes()} />
                  ) : quotes && quotes.length > 0 ? (
                    <div className="space-y-6">
                      {quotes.map((quote) => (
                        <Card key={quote.id} className="border-l-8 border-l-accent rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                              <div className="flex items-start gap-4 flex-grow">
                                {quote.service?.image && (
                                  <img
                                    src={quote.service.image}
                                    alt={quote.service.name}
                                    className="w-24 h-24 rounded-lg object-cover shadow-sm"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-foreground mb-1">
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
                                <Badge className={`${getStatusColor(quote.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(quote.status)}
                                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                  </div>
                                </Badge>
                                {quote.quote_amount && (
                                  <div className="text-xl font-extrabold text-primary">
                                    KSh {quote.quote_amount.toLocaleString()}
                                  </div>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  Requested {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                                </div>
                                <Button variant="outline" size="sm" className="mt-2 bg-black text-white hover:bg-gray-800 border-black">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/40 rounded-lg">
                      <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">No quotes yet</p>
                      <p className="text-sm text-muted-foreground">Your moving service quotes will appear here.</p>
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
