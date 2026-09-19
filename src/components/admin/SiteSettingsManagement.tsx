"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Settings, Plus, Edit, Save, X, Eye, EyeOff } from "lucide-react";

interface SiteSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  settingType: string;
  updatedAt: string;
}

const settingTypes = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'json', label: 'JSON' },
];

// Predefined common settings
const predefinedSettings = [
  { key: 'site_name', label: 'Site Name', type: 'text', defaultValue: 'Geetato' },
  { key: 'site_description', label: 'Site Description', type: 'textarea', defaultValue: 'Premium healthy snacks and wellness products' },
  { key: 'contact_email', label: 'Contact Email', type: 'email', defaultValue: 'contact@geetato.com' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text', defaultValue: '+91-XXXXXXXXXX' },
  { key: 'business_hours', label: 'Business Hours', type: 'text', defaultValue: 'Mon-Sat: 9AM-6PM' },
  { key: 'shipping_policy', label: 'Shipping Policy', type: 'textarea', defaultValue: 'Free shipping on orders above ₹500' },
  { key: 'return_policy', label: 'Return Policy', type: 'textarea', defaultValue: '30-day return policy' },
  { key: 'privacy_policy', label: 'Privacy Policy URL', type: 'url', defaultValue: '/privacy-policy' },
  { key: 'terms_of_service', label: 'Terms of Service URL', type: 'url', defaultValue: '/terms-of-service' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'url', defaultValue: '' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'url', defaultValue: '' },
  { key: 'twitter_url', label: 'Twitter URL', type: 'url', defaultValue: '' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', defaultValue: '' },
  { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'boolean', defaultValue: 'false' },
  { key: 'analytics_tracking_id', label: 'Analytics Tracking ID', type: 'text', defaultValue: '' },
  { key: 'currency_symbol', label: 'Currency Symbol', type: 'text', defaultValue: '₹' },
  { key: 'default_language', label: 'Default Language', type: 'text', defaultValue: 'en' },
  { key: 'timezone', label: 'Timezone', type: 'text', defaultValue: 'Asia/Kolkata' },
];

export default function SiteSettingsManagement() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [formData, setFormData] = useState({
    settingKey: '',
    settingValue: '',
    settingType: 'text'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to fetch settings");
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error("Error loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetting = async () => {
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Setting added successfully");
        setIsAddDialogOpen(false);
        resetForm();
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add setting");
      }
    } catch (error) {
      console.error('Error adding setting:', error);
      toast.error("Error adding setting");
    }
  };

  const handleUpdateSetting = async () => {
    if (!editingSetting) return;

    try {
      const response = await fetch(`/api/site-settings/${editingSetting.settingKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingValue: formData.settingValue,
          settingType: formData.settingType
        }),
      });

      if (response.ok) {
        toast.success("Setting updated successfully");
        setEditingSetting(null);
        resetForm();
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update setting");
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error("Error updating setting");
    }
  };

  const handleDeleteSetting = async (settingKey: string) => {
    try {
      const response = await fetch(`/api/site-settings/${settingKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Setting deleted successfully");
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete setting");
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast.error("Error deleting setting");
    }
  };

  const handleAddPredefinedSetting = async (setting: typeof predefinedSettings[0]) => {
    // Check if setting already exists
    const existingSetting = settings.find(s => s.settingKey === setting.key);
    if (existingSetting) {
      toast.info("Setting already exists");
      return;
    }

    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingKey: setting.key,
          settingValue: setting.defaultValue,
          settingType: setting.type
        }),
      });

      if (response.ok) {
        toast.success(`${setting.label} added successfully`);
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add setting");
      }
    } catch (error) {
      console.error('Error adding predefined setting:', error);
      toast.error("Error adding setting");
    }
  };

  const openEditDialog = (setting: SiteSetting) => {
    setEditingSetting(setting);
    setFormData({
      settingKey: setting.settingKey,
      settingValue: setting.settingValue,
      settingType: setting.settingType
    });
  };

  const resetForm = () => {
    setFormData({
      settingKey: '',
      settingValue: '',
      settingType: 'text'
    });
  };

  const getSettingTypeIcon = (type: string) => {
    switch (type) {
      case 'boolean':
        return <Eye className="h-4 w-4" />;
      case 'url':
        return <Settings className="h-4 w-4" />;
      case 'email':
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const renderSettingInput = (type: string, value: string, onChange: (value: string) => void) => {
    switch (type) {
      case 'boolean':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      default:
        return (
          <Input
            type={type === 'email' ? 'email' : type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
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
          <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>
          <p className="text-muted-foreground">
            Manage site-wide settings and configurations ({settings.length} settings)
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Setting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Setting</DialogTitle>
                <DialogDescription>
                  Create a new custom site setting.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settingKey">Setting Key</Label>
                  <Input
                    id="settingKey"
                    value={formData.settingKey}
                    onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })}
                    placeholder="e.g., custom_header_text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settingType">Setting Type</Label>
                  <Select value={formData.settingType} onValueChange={(value) => setFormData({ ...formData, settingType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settingValue">Setting Value</Label>
                  {renderSettingInput(formData.settingType, formData.settingValue, (value) => setFormData({ ...formData, settingValue: value }))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSetting}>
                    Add Setting
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Predefined Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Common Settings</CardTitle>
          <CardDescription>
            Add frequently used site settings with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedSettings.map((setting) => {
              const existingSetting = settings.find(s => s.settingKey === setting.key);
              return (
                <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{setting.label}</div>
                    <div className="text-xs text-muted-foreground">{setting.type}</div>
                  </div>
                  {existingSetting ? (
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      Added
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddPredefinedSetting(setting)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            View and manage all site settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting Key</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell>
                    <div className="font-medium">{setting.settingKey}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getSettingTypeIcon(setting.settingType)}
                      {setting.settingType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {setting.settingType === 'boolean' ? (
                        <Badge variant={setting.settingValue === 'true' ? 'default' : 'secondary'}>
                          {setting.settingValue === 'true' ? 'True' : 'False'}
                        </Badge>
                      ) : setting.settingType === 'textarea' ? (
                        <div className="text-sm text-muted-foreground">
                          {setting.settingValue.substring(0, 50)}...
                        </div>
                      ) : (
                        <span className="text-sm">{setting.settingValue}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(setting.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(setting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSetting(setting.settingKey)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={(open) => !open && setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Update the setting value and type.
            </DialogDescription>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Setting Key</Label>
                <Input value={formData.settingKey} disabled />
                <p className="text-sm text-muted-foreground">Setting key cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSettingType">Setting Type</Label>
                <Select value={formData.settingType} onValueChange={(value) => setFormData({ ...formData, settingType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {settingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSettingValue">Setting Value</Label>
                {renderSettingInput(formData.settingType, formData.settingValue, (value) => setFormData({ ...formData, settingValue: value }))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingSetting(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSetting}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Setting
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
