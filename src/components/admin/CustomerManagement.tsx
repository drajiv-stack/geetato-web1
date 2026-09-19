"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MessageSquare, Building, Search, Eye, Mail, Phone, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ContactSubmission {
  id: number;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface CorporateEnquiry {
  id: number;
  userId?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  enquiryType: string;
  quantityEstimate?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function CustomerManagement() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [corporateEnquiries, setCorporateEnquiries] = useState<CorporateEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CorporateEnquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      // Fetch contact submissions
      const contactsResponse = await fetch('/api/contact');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContactSubmissions(Array.isArray(contactsData) ? contactsData : []);
      }

      // Fetch corporate enquiries
      const enquiriesResponse = await fetch('/api/corporate-enquiry');
      if (enquiriesResponse.ok) {
        const enquiriesData = await enquiriesResponse.json();
        setCorporateEnquiries(Array.isArray(enquiriesData) ? enquiriesData : []);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error("Error loading customer data");
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchCustomerData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Error updating status");
    }
  };

  const updateEnquiryStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/corporate-enquiry/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchCustomerData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Error updating status");
    }
  };

  const filteredContacts = contactSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEnquiries = corporateEnquiries.filter(enquiry => {
    const matchesSearch = enquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><AlertCircle className="mr-1 h-3 w-3" />New</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><AlertCircle className="mr-1 h-3 w-3" />In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Customer Management</h2>
          <p className="text-muted-foreground">
            Manage customer inquiries and business leads
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Submissions</p>
                <p className="text-2xl font-bold">{contactSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Corporate Enquiries</p>
                <p className="text-2xl font-bold">{corporateEnquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Inquiries</p>
                <p className="text-2xl font-bold">
                  {contactSubmissions.filter(s => s.status === 'new').length +
                   corporateEnquiries.filter(e => e.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">
                  {contactSubmissions.filter(s => s.status === 'resolved').length +
                   corporateEnquiries.filter(e => e.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contacts">
            Contact Submissions ({filteredContacts.length})
          </TabsTrigger>
          <TabsTrigger value="enquiries">
            Corporate Enquiries ({filteredEnquiries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.name}</div>
                          <div className="text-sm text-muted-foreground">{submission.email}</div>
                          {submission.phone && (
                            <div className="text-sm text-muted-foreground">{submission.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{submission.subject}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {submission.message.substring(0, 50)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={submission.status}
                            onValueChange={(value) => updateSubmissionStatus(submission.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enquiry.companyName}</div>
                          <div className="text-sm text-muted-foreground">{enquiry.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{enquiry.contactPerson}</div>
                        <div className="text-sm text-muted-foreground">{enquiry.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{enquiry.enquiryType}</Badge>
                        {enquiry.quantityEstimate && (
                          <div className="text-sm text-muted-foreground">
                            Qty: {enquiry.quantityEstimate}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(enquiry.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEnquiry(enquiry);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={enquiry.status}
                            onValueChange={(value) => updateEnquiryStatus(enquiry.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission ? 'Contact Submission Details' : 'Corporate Enquiry Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedSubmission.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedSubmission.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-sm font-medium mt-1">{selectedSubmission.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <Textarea
                  value={selectedSubmission.message}
                  readOnly
                  className="mt-1 min-h-32"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Submitted</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{selectedEnquiry.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm">{selectedEnquiry.contactPerson}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Enquiry Type</Label>
                  <p className="text-sm">{selectedEnquiry.enquiryType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
                </div>
                {selectedEnquiry.quantityEstimate && (
                  <div>
                    <Label className="text-sm font-medium">Quantity Estimate</Label>
                    <p className="text-sm">{selectedEnquiry.quantityEstimate}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <Textarea
                  value={selectedEnquiry.message}
                  readOnly
                  className="mt-1 min-h-32"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Submitted</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
