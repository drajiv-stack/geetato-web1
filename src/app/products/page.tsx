"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, X, Heart, Leaf, Wheat, ChefHat, Snowflake, Package, Grid3x3, List, SlidersHorizontal, ArrowUpDown, Star, MessageCircle, Eye, ExternalLink, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import SignupDialog from "@/components/SignupDialog"

// Main Categories with Icons
const mainCategories = [
  { id: "all", name: "All Products", icon: Package, color: "#E85D75" },
  { id: "Health-Focused Bakery", name: "Health-Focused Bakery", icon: Heart, color: "#F4A261" },
  { id: "Ancient Grains Collection", name: "Ancient Grains Collection", icon: Leaf, color: "#88A85D" },
  { id: "Vegan Options", name: "Vegan Options", icon: ChefHat, color: "#D4A5D4" },
  { id: "Kids' Healthy Treats", name: "Kids' Healthy Treats", icon: Snowflake, color: "#89CFF0" }
]

// Type definitions
interface Product {
  id: number
  name: string
  slug: string
  category: string
  subCategory: string
  description: string
  badge: string | null
  featured: boolean
  rating: number
  reviews: number
  images?: Array<{
    id: number
    productId: number
    imageUrl: string
    altText: string | null
    displayOrder: number
    isPrimary: boolean
  }>
}

type SortOption = "featured" | "rating" | "newest"
type ViewMode = "grid" | "list"

export default function ProductsPage() {
  const [selectedMainCategory, setSelectedMainCategory] = useState("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("all")
  const [showSignupDialog, setShowSignupDialog] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<number | null>(null)
  
  // Database state
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [subCategories, setSubCategories] = useState<Record<string, string[]>>({})
  
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const res = await fetch("/api/products-new")
        if (res.ok) {
          const data = await res.json()

          // Use the product row's image_url directly instead of fetching per-product images
          const productsWithImages = data.map((product: any) => ({
            ...product,
            images: product.imageUrl
              ? [{
                  id: 0,
                  productId: product.id,
                  imageUrl: product.imageUrl,
                  altText: product.name,
                  displayOrder: 0,
                  isPrimary: true
                }]
              : []
          }))

          setAllProducts(productsWithImages)

          // Build subcategories dynamically
          const subCats: Record<string, Set<string>> = {}
          productsWithImages.forEach((p: Product) => {
            if (!subCats[p.category]) {
              subCats[p.category] = new Set()
            }
            if (p.subCategory) {
              subCats[p.category].add(p.subCategory)
            }
          })

          const subCatsObj: Record<string, string[]> = {}
          Object.entries(subCats).forEach(([cat, subs]) => {
            subCatsObj[cat] = Array.from(subs).sort()
          })
          setSubCategories(subCatsObj)
        } else {
          toast.error("Failed to load products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  let filteredProducts = allProducts.filter(product => {
    const matchesMainCategory = selectedMainCategory === "all" || product.category === selectedMainCategory
    const matchesSubCategory = !selectedSubCategory || product.subCategory === selectedSubCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFeatured = !showFeaturedOnly || product.featured
    return matchesMainCategory && matchesSubCategory && matchesSearch && matchesFeatured
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  const sortOptions = [
    { value: "featured" as SortOption, label: "Featured" },
    { value: "rating" as SortOption, label: "Highest Rated" },
    { value: "newest" as SortOption, label: "Newest First" }
  ]

  const handleExpressInterest = async (product: Product) => {
    // Check if user is logged in
    if (!session?.user) {
      setPendingProduct(product)
      setShowSignupDialog(true)
      return
    }

    // User is logged in, add to wishlist
    setIsAddingToWishlist(product.id)
    try {
      const token = localStorage.getItem("bearer_token")
      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
      
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: primaryImage?.imageUrl || "",
        }),
      })

      if (res.ok) {
        toast.success(`${product.name} added to your wishlist!`)
      } else {
        const error = await res.json()
        if (error.code === "ALREADY_EXISTS") {
          toast.info("This product is already in your wishlist")
        } else {
          toast.error("Failed to add to wishlist")
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error("Failed to add to wishlist")
    } finally {
      setIsAddingToWishlist(null)
    }
  }

  const handleSignupSuccess = async () => {
    // After signup, add the pending product to wishlist
    if (pendingProduct) {
      await handleExpressInterest(pendingProduct)
      setPendingProduct(null)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubCategory(null)
    setExpandedCategory(categoryId)
    setShowMobileFilters(false)
  }

  const handleSubCategoryClick = (subCat: string) => {
    setSelectedSubCategory(subCat)
    setShowMobileFilters(false)
  }

  const clearAllFilters = () => {
    setSelectedMainCategory("all")
    setSelectedSubCategory(null)
    setSearchQuery("")
    setShowFeaturedOnly(false)
    setSortBy("featured")
    setExpandedCategory("all")
  }

  const getPrimaryImage = (product: Product) => {
    const primaryImg = product.images?.find(img => img.isPrimary)
    return primaryImg?.imageUrl || product.images?.[0]?.imageUrl || "/placeholder-product.jpg"
  }

  // Sidebar Filter Component
  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'p-6' : 'sticky top-24 h-[calc(100vh-7rem)]'} flex flex-col`}>
      {/* Search in Sidebar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D4037]/60" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-10 text-sm border-2 border-[#E85D75]/20 focus:border-[#E85D75] rounded-xl bg-white"
            style={{ fontFamily: "var(--font-body)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D4037]/60 hover:text-[#E85D75] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#E85D75]/10">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#E85D75]" />
          <h3 className="font-bold text-lg text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
            Filters
          </h3>
        </div>
        {(selectedMainCategory !== "all" || selectedSubCategory || showFeaturedOnly || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#E85D75] hover:text-[#E85D75]/80 transition-colors"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin">
        {/* Featured Only Toggle */}
        <div>
          <h4 className="text-sm font-bold text-[#2C2C2E] mb-3" style={{ fontFamily: "var(--font-accent)" }}>
            Quick Filters
          </h4>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-full ${
              showFeaturedOnly
                ? "bg-[#88A85D] text-white shadow-3d"
                : "bg-[#FAF0E6] text-[#5D4037] border border-[#E85D75]/20 hover:bg-[#88A85D]/10"
            }`}
            style={{ fontFamily: "var(--font-accent)" }}
          >
            <Leaf className="w-4 h-4" />
            Featured Only
          </motion.button>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold text-[#2C2C2E] mb-3" style={{ fontFamily: "var(--font-accent)" }}>
            Categories
          </h4>
          <div className="space-y-2">
            {mainCategories.map((category) => (
              <div key={category.id}>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedMainCategory === category.id
                      ? "bg-[#E85D75] text-white shadow-3d"
                      : "bg-white text-[#5D4037] border border-[#E85D75]/20 hover:bg-[#E85D75]/5"
                  }`}
                  style={{ fontFamily: "var(--font-accent)" }}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  {category.id !== "all" && subCategories[category.id] && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        expandedCategory === category.id ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </motion.button>

                {/* Sub-categories */}
                <AnimatePresence>
                  {selectedMainCategory === category.id && category.id !== "all" && subCategories[category.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 ml-6 space-y-1 overflow-hidden"
                    >
                      <button
                        onClick={() => setSelectedSubCategory(null)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          !selectedSubCategory
                            ? "bg-[#F4A261] text-[#2C2C2E]"
                            : "text-[#5D4037] hover:bg-[#FAF0E6]"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        All {category.name}
                      </button>
                      {subCategories[category.id]?.map((subCat) => (
                        <button
                          key={subCat}
                          onClick={() => handleSubCategoryClick(subCat)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedSubCategory === subCat
                              ? "bg-[#F4A261] text-[#2C2C2E]"
                              : "text-[#5D4037] hover:bg-[#FAF0E6]"
                          }`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {subCat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedSubCategory || showFeaturedOnly) && (
          <div className="pt-4 border-t border-[#E85D75]/10">
            <h4 className="text-sm font-bold text-[#2C2C2E] mb-3" style={{ fontFamily: "var(--font-accent)" }}>
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedSubCategory && (
                <Badge className="bg-[#F4A261] text-[#2C2C2E] flex items-center gap-1 pr-1">
                  {selectedSubCategory}
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="ml-1 hover:bg-[#2C2C2E]/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {showFeaturedOnly && (
                <Badge className="bg-[#88A85D] text-white flex items-center gap-1 pr-1">
                  Featured
                  <button
                    onClick={() => setShowFeaturedOnly(false)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navigation />
      
      {/* Hero Section - Reduced Height */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#FAF0E6] via-[#FAFAF8] to-[#D4A5D4]/10 paper-texture relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.06, 0.03],
              rotateZ: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
            style={{ background: "linear-gradient(135deg, #E85D75, #F4A261)" }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#E85D75]/10 text-[#E85D75] px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-[#E85D75]/30 shadow-3d"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              <Package className="w-4 h-4" />
              {isLoadingProducts ? "Loading..." : `${filteredProducts.length}+ Premium Products`}
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
              Explore Our <span className="text-[#E85D75]">Collection</span>
            </h1>
            <p className="text-lg text-[#5D4037]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              From health-focused bakery to traditional Indian delights, discover authentic flavors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content: Sidebar + Products */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-3d border-2 border-[#E85D75]/10 p-6">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <Button
                onClick={() => setShowMobileFilters(true)}
                className="bg-[#E85D75] hover:bg-[#E85D75]/90 text-white rounded-full shadow-3d px-6 py-6 font-bold"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {(selectedSubCategory || showFeaturedOnly) && (
                  <Badge className="ml-2 bg-white text-[#E85D75]">
                    {(selectedSubCategory ? 1 : 0) + (showFeaturedOnly ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 30 }}
                    className="lg:hidden fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 overflow-y-auto shadow-3d"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-[#E85D75]/10">
                      <h2 className="text-xl font-black text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                        Filters
                      </h2>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 hover:bg-[#FAF0E6] rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <FilterSidebar isMobile />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Area */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: Results, Sort, View Mode */}
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border-2 border-[#E85D75]/10 shadow-3d">
                <div className="flex flex-col gap-1">
                  <p className="text-[#5D4037]/70 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    Showing <span className="font-bold text-[#E85D75]">{filteredProducts.length}</span> of <span className="font-bold">{allProducts.length}</span> products
                  </p>
                  {selectedSubCategory && (
                    <p className="text-xs text-[#5D4037]/50" style={{ fontFamily: "var(--font-body)" }}>
                      in {selectedSubCategory}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="border-2 border-[#E85D75]/20 hover:border-[#E85D75] font-semibold rounded-xl"
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {sortOptions.find(opt => opt.value === sortBy)?.label}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <AnimatePresence>
                      {showSortMenu && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setShowSortMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-3d border-2 border-[#E85D75]/10 z-50 overflow-hidden"
                          >
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value)
                                  setShowSortMenu(false)
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-[#FAF0E6] transition-colors font-semibold text-sm ${
                                  sortBy === option.value ? "bg-[#E85D75]/10 text-[#E85D75]" : "text-[#5D4037]"
                                }`}
                                style={{ fontFamily: "var(--font-accent)" }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-[#FAF0E6] rounded-xl p-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-[#E85D75] text-white shadow-3d"
                          : "text-[#5D4037]/60 hover:text-[#E85D75]"
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-[#E85D75] text-white shadow-3d"
                          : "text-[#5D4037]/60 hover:text-[#E85D75]"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Products Grid/List */}
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#E85D75] mx-auto mb-4" />
                    <p className="text-lg text-[#5D4037]/70 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                      Loading products...
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {filteredProducts.length > 0 ? (
                    <motion.div
                      key={`${selectedMainCategory}-${selectedSubCategory}-${viewMode}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={viewMode === "grid" 
                        ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6 perspective-container"
                        : "space-y-6"
                      }
                    >
                      {filteredProducts.map((product, idx) => {
                        const primaryImage = getPrimaryImage(product)
                        
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            layout
                          >
                            {viewMode === "grid" ? (
                              /* Grid View */
                              <Card className="group overflow-hidden border-2 border-transparent hover:border-[#E85D75] transition-all duration-300 hover:shadow-3d h-full bg-white rounded-3xl card-3d">
                                <div className="relative h-64 overflow-hidden">
                                  <Link href={`/products/${product.id}`} className="cursor-pointer">
                                    <motion.img
                                      whileHover={{ scale: 1.15, rotateZ: 2 }}
                                      transition={{ duration: 0.5 }}
                                      src={primaryImage}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      style={{ transformStyle: "preserve-3d" }}
                                    />
                                  </Link>
                                  {product.badge && (
                                    <motion.div 
                                      className="absolute top-4 right-4"
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                      <Badge className="bg-[#F4A261] text-[#2C2C2E] font-bold border-0 shadow-3d" style={{ fontFamily: "var(--font-accent)" }}>
                                        {product.badge}
                                      </Badge>
                                    </motion.div>
                                  )}
                                  {product.featured && (
                                    <motion.div
                                      className="absolute top-4 left-4"
                                      whileHover={{ scale: 1.1, rotate: -5 }}
                                    >
                                      <Badge className="bg-[#E85D75] text-white font-bold border-0 shadow-3d" style={{ fontFamily: "var(--font-accent)" }}>
                                        Featured
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                                
                                <div className="p-6">
                                  <p className="text-xs text-[#88A85D] font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-accent)" }}>
                                    {product.subCategory}
                                  </p>
                                  <Link href={`/products/${product.id}`} className="cursor-pointer">
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-[#E85D75] transition-colors text-[#2C2C2E] line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                                      {product.name}
                                    </h3>
                                  </Link>
                                  
                                  {/* Rating */}
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 ${
                                            i < Math.floor(product.rating)
                                              ? "fill-[#F4A261] text-[#F4A261]"
                                              : "text-[#E8E5E1]"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>
                                      {product.rating} ({product.reviews})
                                    </span>
                                  </div>
                                  
                                  {/* Action Buttons Row - All Inline */}
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleExpressInterest(product)
                                      }}
                                      disabled={isAddingToWishlist === product.id}
                                      className="flex-1 bg-[#E85D75] hover:bg-[#E85D75]/90 text-white rounded-full btn-3d cursor-pointer"
                                      style={{ fontFamily: "var(--font-accent)" }}
                                    >
                                      {isAddingToWishlist === product.id ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      ) : (
                                        <Heart className="w-4 h-4 mr-2" />
                                      )}
                                      Interested
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setQuickViewProduct(product)
                                      }}
                                      className="border-2 border-[#E85D75]/20 hover:border-[#E85D75] hover:bg-[#E85D75]/5 text-[#E85D75] rounded-full cursor-pointer"
                                      style={{ fontFamily: "var(--font-accent)" }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      asChild
                                      className="border-2 border-[#E85D75]/20 hover:border-[#E85D75] hover:bg-[#E85D75]/5 text-[#E85D75] rounded-full cursor-pointer"
                                      style={{ fontFamily: "var(--font-accent)" }}
                                    >
                                      <Link href={`/products/${product.id}`}>
                                        <ExternalLink className="w-4 h-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ) : (
                              /* List View */
                              <Card className="group overflow-hidden border-2 border-transparent hover:border-[#E85D75] transition-all duration-300 hover:shadow-3d bg-white rounded-3xl card-3d">
                                <div className="flex flex-col sm:flex-row gap-6 p-6">
                                  <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl">
                                    <Link href={`/products/${product.id}`} className="cursor-pointer">
                                      <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        src={primaryImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </Link>
                                    {product.badge && (
                                      <motion.div 
                                        className="absolute top-3 right-3"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                      >
                                        <Badge className="bg-[#F4A261] text-[#2C2C2E] font-bold border-0 shadow-3d text-xs" style={{ fontFamily: "var(--font-accent)" }}>
                                          {product.badge}
                                        </Badge>
                                      </motion.div>
                                    )}
                                    {product.featured && (
                                      <motion.div
                                        className="absolute top-3 left-3"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                      >
                                        <Badge className="bg-[#E85D75] text-white font-bold border-0 shadow-3d text-xs" style={{ fontFamily: "var(--font-accent)" }}>
                                          Featured
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col">
                                    <p className="text-xs text-[#88A85D] font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-accent)" }}>
                                      {product.subCategory}
                                    </p>
                                    <Link href={`/products/${product.id}`} className="cursor-pointer">
                                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#E85D75] transition-colors text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                                        {product.name}
                                      </h3>
                                    </Link>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < Math.floor(product.rating)
                                                ? "fill-[#F4A261] text-[#F4A261]"
                                                : "text-[#E8E5E1]"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>
                                        {product.rating} ({product.reviews} reviews)
                                      </span>
                                    </div>
                                    
                                    <div className="mt-auto flex flex-wrap gap-2">
                                      <Button 
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          handleExpressInterest(product)
                                        }}
                                        disabled={isAddingToWishlist === product.id}
                                        className="flex-1 min-w-[140px] bg-[#E85D75] hover:bg-[#E85D75]/90 text-white rounded-full btn-3d cursor-pointer"
                                        style={{ fontFamily: "var(--font-accent)" }}
                                      >
                                        {isAddingToWishlist === product.id ? (
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                          <Heart className="w-4 h-4 mr-2" />
                                        )}
                                        I'm Interested
                                      </Button>
                                      <Button 
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setQuickViewProduct(product)
                                        }}
                                        variant="outline"
                                        className="border-2 border-[#F4A261] text-[#F4A261] hover:bg-[#F4A261] hover:text-white rounded-full cursor-pointer"
                                        style={{ fontFamily: "var(--font-accent)" }}
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Quick View
                                      </Button>
                                      <Button 
                                        size="sm"
                                        variant="outline"
                                        className="border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white rounded-full cursor-pointer"
                                        style={{ fontFamily: "var(--font-accent)" }}
                                        asChild
                                      >
                                        <Link href={`/products/${product.id}`}>
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          View Details
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            )}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E85D75]/10 mb-6">
                        <Search className="w-10 h-10 text-[#E85D75]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#2C2C2E] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                        No products found
                      </h3>
                      <p className="text-lg text-[#5D4037]/60 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                        Try adjusting your filters or search terms
                      </p>
                      <Button
                        onClick={clearAllFilters}
                        className="bg-[#F4A261] hover:bg-[#E27D60] text-[#2C2C2E] font-bold rounded-full btn-3d cursor-pointer"
                        style={{ fontFamily: "var(--font-accent)" }}
                      >
                        Clear All Filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-[#E85D75]/20">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                  {quickViewProduct.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8 mt-4">
                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF0E6] border-2 border-[#E85D75]/10">
                  <img
                    src={getPrimaryImage(quickViewProduct)}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {quickViewProduct.badge && (
                    <Badge className="absolute top-4 right-4 bg-[#F4A261] text-[#2C2C2E] font-bold border-0 shadow-3d">
                      {quickViewProduct.badge}
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <p className="text-sm text-[#88A85D] font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-accent)" }}>
                    {quickViewProduct.subCategory}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? "fill-[#F4A261] text-[#F4A261]"
                              : "text-[#E8E5E1]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>
                      {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="text-[#5D4037]/80 leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                      {quickViewProduct.description}
                    </p>

                    <div className="bg-[#FAF0E6] rounded-2xl p-4 mb-6">
                      <p className="text-sm text-[#5D4037]/70 mb-2 font-semibold" style={{ fontFamily: "var(--font-accent)" }}>
                        Category
                      </p>
                      <p className="text-[#2C2C2E] font-bold" style={{ fontFamily: "var(--font-body)" }}>
                        {quickViewProduct.subCategory}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <Button
                      size="lg"
                      onClick={() => {
                        handleExpressInterest(quickViewProduct)
                        setQuickViewProduct(null)
                      }}
                      disabled={isAddingToWishlist === quickViewProduct.id}
                      className="flex-1 bg-[#E85D75] hover:bg-[#E85D75]/90 text-white rounded-full btn-3d cursor-pointer"
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      {isAddingToWishlist === quickViewProduct.id ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 mr-2" />
                      )}
                      I'm Interested
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white rounded-full cursor-pointer"
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      <Link href={`/products/${quickViewProduct.id}`}>
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Full Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <SignupDialog
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        onSuccess={handleSignupSuccess}
        productName={pendingProduct?.name}
      />

      <Footer />
    </div>
  )
}