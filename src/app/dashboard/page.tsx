"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Package,
  Settings,
  Mail,
  BarChart3
} from "lucide-react";
import ProductManagement from "@/components/admin/ProductManagement";
import CustomerManagement from "@/components/admin/CustomerManagement";
import SiteSettingsManagement from "@/components/admin/SiteSettingsManagement";
import NewsletterManagement from "@/components/admin/NewsletterManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function DashboardPage() {
  // Authentication and admin check DISABLED
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" /> Customers
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Site Settings
          </TabsTrigger>
          <TabsTrigger value="newsletter">
            <Mail className="mr-2 h-4 w-4" /> Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="customers" className="mt-6">
          <CustomerManagement />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SiteSettingsManagement />
        </TabsContent>
        <TabsContent value="newsletter" className="mt-6">
          <NewsletterManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
