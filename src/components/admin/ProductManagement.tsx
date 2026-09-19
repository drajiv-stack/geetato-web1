"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Package, Star, Eye, EyeOff } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  sub_category?: string;
  image_url: string;
  badge?: string;
  health_goal?: string;
  rating: string;
  reviews_count: number;
  description: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  calories?: string;
  is_active: number;
  sort_order: number;
  featured?: number;
  price?: number;
  weight?: string;
  availability?: string;
  tags?: string;
  health_tags?: string;
  dietary_tags?: string;
  shelf_life_days?: number;
  storage_instructions?: string;
  serving_size?: string;
  servings_per_package?: number;
  is_featured?: number;
  is_bestseller?: number;
  is_new_arrival?: number;
  available_for_b2b?: number;
  available_for_export?: number;
  minimum_order_quantity?: number;
}

interface ProductFormData {
  name: string;
  category: string;
  sub_category: string;
  image_url: string;
  badge: string;
  health_goal: string;
  description: string;
  protein: string;
  carbs: string;
  fat: string;
  calories: string;
  price: number;
  weight: string;
  availability: string;
  featured: boolean;
  is_active: boolean;
}

const categories = [
  "Sugar-Free",
  "Fiber Rich",
  "Gluten-Free",
  "Classic",
  "Spicy",
  "Premium",
  "Festival",
  "Artisan",
  "Popular",
  "Traditional",
  "Savory",
  "Frozen",
  "Party Pack",
  "Sweet",
  "Organic",
  "Special",
  "Fitness",
  "Natural",
  "Best Seller",
  "High Fiber",
  "Low GI",
  "Diabetic-Safe",
  "High Protein",
  "Light",
  "Bestseller",
  "Regional",
  "Authentic",
  "Eggless",
  "Convenient",
  "Quick Fry",
  "Fresh",
  "Easy Meal",
  "Instant",
  "Superfood",
  "Tangy",
  "Healthy",
  "Starter"
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    sub_category: "",
    image_url: "",
    badge: "",
    health_goal: "",
    description: "",
    protein: "",
    carbs: "",
    fat: "",
    calories: "",
    price: 0,
    weight: "",
    availability: "in-stock",
    featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=1000');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, ''),
        rating: '4.5',
        reviews_count: 0,
        sort_order: products.length + 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Product added successfully");
        setIsAddDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add product");
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Error adding product");
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, ''),
        rating: editingProduct.rating || '4.5',
        reviews_count: editingProduct.reviews_count || 0,
        sort_order: editingProduct.sort_order || 0,
        created_at: editingProduct.created_at,
        updated_at: new Date(),
      };

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Product updated successfully");
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update product");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error updating product");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error deleting product");
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sub_category: product.sub_category || "",
      image_url: product.image_url,
      badge: product.badge || "",
      health_goal: product.health_goal || "",
      description: product.description,
      protein: product.protein || "",
      carbs: product.carbs || "",
      fat: product.fat || "",
      calories: product.calories || "",
      price: product.price || 0,
      weight: product.weight || "",
      availability: product.availability || "in-stock",
      featured: Boolean(product.featured),
      is_active: Boolean(product.is_active)
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      sub_category: "",
      image_url: "",
      badge: "",
      health_goal: "",
      description: "",
      protein: "",
      carbs: "",
      fat: "",
      calories: "",
      price: 0,
      weight: "",
      availability: "in-stock",
      featured: false,
      is_active: true
    });
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
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product in your catalog.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddProduct}
              submitLabel="Add Product"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.price ? `₹${product.price}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {product.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Eye className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews_count})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditProduct}
            submitLabel="Update Product"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel
}: {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sub_category">Sub Category</Label>
          <Input
            id="sub_category"
            value={formData.sub_category}
            onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
            placeholder="Enter sub category"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Input
            id="badge"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="e.g., Best Seller, New"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="e.g., 250g"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="protein">Protein</Label>
          <Input
            id="protein"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            placeholder="e.g., 5g"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs">Carbs</Label>
          <Input
            id="carbs"
            value={formData.carbs}
            onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
            placeholder="e.g., 20g"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat">Fat</Label>
          <Input
            id="fat"
            value={formData.fat}
            onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
            placeholder="e.g., 8g"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            placeholder="e.g., 150"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_active">Active Product</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setFormData({
          name: "",
          category: "",
          sub_category: "",
          image_url: "",
          badge: "",
          health_goal: "",
          description: "",
          protein: "",
          carbs: "",
          fat: "",
          calories: "",
          price: 0,
          weight: "",
          availability: "in-stock",
          featured: false,
          is_active: true
        })}>
          Reset
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
