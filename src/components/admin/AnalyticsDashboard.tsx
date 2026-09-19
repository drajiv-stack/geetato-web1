"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Eye,
  DollarSign,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalVisitors: number;
  conversionRate: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    orders: number;
    visitors: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 245680,
    totalOrders: 1247,
    totalVisitors: 45632,
    conversionRate: 2.73,
    topProducts: [
      { name: "Sugar-Free Brownies", sales: 245, revenue: 36750 },
      { name: "Stevia Cookie Pack", sales: 189, revenue: 28350 },
      { name: "Flax Seed Crackers", sales: 156, revenue: 23400 },
      { name: "Millet Flour Cookies", sales: 134, revenue: 20100 },
      { name: "Jaggery Energy Bites", sales: 98, revenue: 14700 }
    ],
    monthlyData: [
      { month: "Jan", revenue: 18500, orders: 94, visitors: 3200 },
      { month: "Feb", revenue: 22100, orders: 112, visitors: 3650 },
      { month: "Mar", revenue: 19800, orders: 101, visitors: 3420 },
      { month: "Apr", revenue: 25600, orders: 134, visitors: 4120 },
      { month: "May", revenue: 28900, orders: 148, visitors: 4680 },
      { month: "Jun", revenue: 31200, orders: 156, visitors: 4980 }
    ],
    recentOrders: [
      {
        id: "ORD-001",
        customer: "Priya Sharma",
        product: "Sugar-Free Brownies",
        amount: 150,
        status: "completed",
        date: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "ORD-002",
        customer: "Rahul Kumar",
        product: "Stevia Cookie Pack",
        amount: 200,
        status: "processing",
        date: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "ORD-003",
        customer: "Anjali Patel",
        product: "Flax Seed Crackers",
        amount: 180,
        status: "shipped",
        date: new Date(Date.now() - 10800000).toISOString()
      }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Revenue and orders over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-xs font-medium">
                      {data.month}
                    </div>
                    <div>
                      <div className="text-sm font-medium">₹{data.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{data.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{data.visitors} visitors</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best-selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sales} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{product.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.product}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">₹{order.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Repeat Customers</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Order Value</span>
                <span className="text-sm font-medium">₹197</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
                <span className="text-sm font-medium">₹1,247</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Top Category</span>
                <span className="text-sm font-medium">Sugar-Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                <span className="text-sm font-medium">4.7 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Return Rate</span>
                <span className="text-sm font-medium">2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Marketing Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email Open Rate</span>
                <span className="text-sm font-medium">24.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Social Engagement</span>
                <span className="text-sm font-medium">8.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Referral Rate</span>
                <span className="text-sm font-medium">12.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
