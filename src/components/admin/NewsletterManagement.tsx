"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Users, Send, Plus, TrendingUp, Calendar, UserCheck, UserX } from "lucide-react";

interface NewsletterSubscriber {
  id: number;
  email: string;
  userId?: string;
  subscribed: boolean;
  preferences?: any;
  createdAt: string;
  unsubscribedAt?: string;
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    recipientType: 'all' // 'all', 'active', 'inactive'
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(Array.isArray(data.subscribers) ? data.subscribers : []);
      } else {
        toast.error("Failed to fetch subscribers");
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error("Error loading subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsletterData),
      });

      if (response.ok) {
        toast.success("Newsletter sent successfully");
        setIsComposeDialogOpen(false);
        setNewsletterData({ subject: '', content: '', recipientType: 'all' });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send newsletter");
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error("Error sending newsletter");
    }
  };

  const toggleSubscription = async (subscriberId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${subscriberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscribed: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Subscriber ${!currentStatus ? 'subscribed' : 'unsubscribed'}`);
        fetchSubscribers();
      } else {
        toast.error("Failed to update subscription");
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error("Error updating subscription");
    }
  };

  const activeSubscribers = subscribers.filter(s => s.subscribed);
  const inactiveSubscribers = subscribers.filter(s => !s.subscribed);
  const totalSubscribers = subscribers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Newsletter Management</h2>
          <p className="text-muted-foreground">
            Manage email subscriptions and campaigns ({totalSubscribers} subscribers)
          </p>
        </div>
        <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Compose Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Newsletter</DialogTitle>
              <DialogDescription>
                Create and send a newsletter to your subscribers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={newsletterData.subject}
                  onChange={(e) => setNewsletterData({ ...newsletterData, subject: e.target.value })}
                  placeholder="Enter newsletter subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientType">Recipients</Label>
                <select
                  id="recipientType"
                  value={newsletterData.recipientType}
                  onChange={(e) => setNewsletterData({ ...newsletterData, recipientType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Subscribers ({totalSubscribers})</option>
                  <option value="active">Active Only ({activeSubscribers.length})</option>
                  <option value="inactive">Inactive Only ({inactiveSubscribers.length})</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newsletterData.content}
                  onChange={(e) => setNewsletterData({ ...newsletterData, content: e.target.value })}
                  placeholder="Enter newsletter content (HTML supported)"
                  rows={10}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendNewsletter}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Newsletter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeSubscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{inactiveSubscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">
                  {totalSubscribers > 0 ? ((activeSubscribers.length / totalSubscribers) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Newsletter Activity</CardTitle>
          <CardDescription>Latest subscriber activities and newsletter performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">New Subscription</p>
                <p className="text-sm text-green-700">user@example.com subscribed to newsletter</p>
              </div>
              <div className="text-sm text-green-600">
                2 hours ago
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <Send className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Newsletter Sent</p>
                <p className="text-sm text-blue-700">"Monthly Health Tips" sent to 245 subscribers</p>
              </div>
              <div className="text-sm text-blue-600">
                1 day ago
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <div className="flex-shrink-0">
                <UserX className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Unsubscription</p>
                <p className="text-sm text-red-700">olduser@example.com unsubscribed</p>
              </div>
              <div className="text-sm text-red-600">
                3 days ago
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Management</CardTitle>
          <CardDescription>View and manage newsletter subscribers</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.slice(0, 20).map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <div className="font-medium">{subscriber.email}</div>
                    {subscriber.userId && (
                      <div className="text-sm text-muted-foreground">Registered User</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.subscribed ? "default" : "secondary"}>
                      {subscriber.subscribed ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {subscriber.unsubscribedAt
                      ? `Unsubscribed ${new Date(subscriber.unsubscribedAt).toLocaleDateString()}`
                      : "Active"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSubscription(subscriber.id, subscriber.subscribed)}
                    >
                      {subscriber.subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {subscribers.length > 20 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Showing first 20 subscribers. Total: {subscribers.length}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
