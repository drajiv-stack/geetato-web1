"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Leaf, Shield, Award, Users, Package, Star, Globe, Play, CheckCircle, MessageCircle, X, Plus, Minus, Instagram, Camera, Eye, ExternalLink, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const benefits = [
{
  icon: Heart,
  title: "100% Natural",
  description: "No artificial preservatives, colors, or additives"
},
{
  icon: Leaf,
  title: "Indian Superfoods",
  description: "Ragi, millet, quinoa & ancient grains"
},
{
  icon: Shield,
  title: "FSSAI Certified",
  description: "HACCP & ISO certified facilities"
},
{
  icon: Globe,
  title: "Global Export",
  description: "Trusted worldwide for quality & taste"
}];


const testimonials = [
{
  name: "Priya Sharma",
  role: "Fitness Coach",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  quote: "Finally, guilt-free treats that taste amazing! My clients love the protein cookies.",
  image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80"
},
{
  name: "Rajesh Patel",
  role: "Corporate Client",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  quote: "We order Geetato for all our office events. The quality and taste are unmatched!",
  image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80"
},
{
  name: "Ananya Reddy",
  role: "Health Blogger",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  quote: "Love how they blend traditional Indian flavors with modern health needs. Absolutely delicious!",
  image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"
}];


const partners = [
"Swiggy", "Zomato", "BigBasket", "Amazon", "Flipkart", "Blinkit"];


const certifications = [
{ name: "FSSAI", icon: Shield },
{ name: "HACCP", icon: Award },
{ name: "ISO 22000", icon: Star }];


const customerPhotos = [
{
  id: 1,
  image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80",
  username: "@priya_fitlife",
  caption: "Perfect post-workout snack! 🏋️‍♀️"
},
{
  id: 2,
  image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
  username: "@rajesh_corporate",
  caption: "Office favorite snacks! 💼"
},
{
  id: 3,
  image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
  username: "@ananya_wellness",
  caption: "Guilt-free indulgence 💚"
},
{
  id: 4,
  image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
  username: "@foodie_mumbai",
  caption: "Healthy meets delicious! 🍪"
},
{
  id: 5,
  image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
  username: "@yoga_with_neha",
  caption: "My go-to energy boost! ⚡"
},
{
  id: 6,
  image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
  username: "@healthy_habits_in",
  caption: "Ancient grains, modern taste! ✨"
}];


const instagramPosts = [
{
  id: 1,
  image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
  likes: 2340,
  comments: 89
},
{
  id: 2,
  image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80",
  likes: 1890,
  comments: 67
},
{
  id: 3,
  image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80",
  likes: 3120,
  comments: 124
},
{
  id: 4,
  image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80",
  likes: 2670,
  comments: 93
}];


export default function Home() {
  const heroRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showVideo, setShowVideo] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<any>(null);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products-new');
        if (response.ok) {
          const data = await response.json();

          // Use the image and nutrition already stored on the product row
          const productsWithImages = data.map((product: any) => {
            const normalizeUnit = (val: any) => {
              if (!val) return '0g';
              const s = `${val}`;
              return s.endsWith('g') ? s : `${s}g`;
            };

            const nutrition = {
              protein: normalizeUnit(product.protein),
              carbs: normalizeUnit(product.carbs),
              fat: normalizeUnit(product.fat),
              calories: product.calories ? `${product.calories}` : '0'
            };

            return {
              id: product.id,
              name: product.name,
              category: product.category,
              image: product.imageUrl || '/placeholder-product.jpg',
              badge: product.badge || 'New',
              healthGoal: product.healthGoal,
              rating: product.rating || 0,
              reviews: product.reviews || 0,
              description: product.description,
              nutrition
            };
          });

          setProducts(productsWithImages.slice(0, 6)); // Show first 6 products on homepage
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeFilter === "all" ?
  products :
  products.filter((p) => p.healthGoal === activeFilter);

  const handleExpressInterest = async (product: any) => {
    // Check if user is logged in
    if (!session?.user) {
      // Show signup modal instead of immediate redirect
      setPendingProduct(product);
      setShowSignupModal(true);
      setQuickViewProduct(null);
      return;
    }

    setAddingToWishlist(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: product.image
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        toast.info("This product is already in your wishlist!");
      } else if (response.ok) {
        toast.success(`${product.name} added to your wishlist!`);
      } else {
        toast.error(data.error || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist. Please try again.");
    } finally {
      setAddingToWishlist(false);
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Video Background Option - Enhanced */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background with Fallback */}
        <div className="absolute inset-0 z-0">
          {showVideo ?
          <div className="relative w-full h-full">
              <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover">

                <source src="/videos/hero-background.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FAF0E6]/95 via-[#FAFAF8]/90 to-[#FAF0E6]/95" />
            </div> :

          <div className="absolute inset-0 bg-gradient-to-br from-[#FAF0E6] via-[#FAFAF8] to-[#FAF0E6] paper-texture !block !bg-slate-50" />
          }
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10 !block !flex-row">

          <div className="grid lg:grid-cols-2 gap-12 items-center !w-full !h-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}>

              {/* Trust Badges - Prominent Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 mb-6">

                <div className="inline-flex items-center gap-2 bg-[#88A85D]/20 text-[#5D4037] px-4 py-2 rounded-full font-semibold text-xs border border-[#88A85D]/30 shadow-3d">
                  <Shield className="w-4 h-4 text-[#88A85D]" />
                  FSSAI Certified
                </div>
                <div className="inline-flex items-center gap-2 bg-[#E85D75]/20 text-[#E85D75] px-4 py-2 rounded-full font-semibold text-xs border border-[#E85D75]/30 shadow-3d">
                  <CheckCircle className="w-4 h-4" />
                  100% Natural
                </div>
                <div className="inline-flex items-center gap-2 bg-[#F4A261]/20 text-[#A67C52] px-4 py-2 rounded-full font-semibold text-xs border border-[#F4A261]/30 shadow-3d">
                  <Globe className="w-4 h-4" />
                  Global Export
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-[#88A85D]/20 text-[#5D4037] px-4 py-2 rounded-full mb-6 font-semibold text-sm border border-[#88A85D]/30 shadow-3d"
                style={{ fontFamily: "var(--font-accent)", transform: "translateZ(20px)" }}
                role="status"
                aria-label="New product announcement">

                <Sparkles className="w-4 h-4 text-[#88A85D]" aria-hidden="true" />
                New: Protein-Packed Almond Delights
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                Ancient Grains.{" "}
                <span className="text-[#E85D75] relative inline-block">
                  Modern Nutrition
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}>

                    <motion.path
                      d="M5,7 Q150,2 295,7"
                      stroke="#E85D75"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round" />

                  </motion.svg>
                </span>
                .{" "}
                <span className="text-[#88A85D]">Authentic Taste</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#5D4037]/80 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Discover health-first Indian delights crafted with ancient grains, 
                modern nutrition, and authentic flavors. Share your interests and we'll reach out with details.
              </p>
              
              {/* Enhanced Dual CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 perspective-container mb-8">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#E85D75] hover:bg-[#E85D75]/90 text-white font-bold text-lg h-16 px-10 group focus:ring-2 focus:ring-[#E85D75] focus:ring-offset-2 shadow-3d btn-3d"
                  style={{ fontFamily: "var(--font-accent)" }}>

                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-[#F4A261] text-[#A67C52] hover:bg-[#F4A261] hover:text-white font-bold text-lg h-16 px-10 focus:ring-2 focus:ring-[#F4A261] focus:ring-offset-2 btn-3d bg-white/80 backdrop-blur-sm"
                  style={{ fontFamily: "var(--font-accent)" }}>

                  <Link href="/contact">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Contact Us
                  </Link>
                </Button>
              </div>

              {/* Social Proof Stats */}
              <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="card-3d"
                  style={{ transformStyle: "preserve-3d" }}>

                  <div className="text-2xl sm:text-3xl font-black text-[#E85D75]" style={{ fontFamily: "var(--font-heading)" }}>10K+</div>
                  <div className="text-xs sm:text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>Happy Customers</div>
                </motion.div>
                <div className="w-px h-12 bg-[#E85D75]/20"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 }}
                  className="card-3d"
                  style={{ transformStyle: "preserve-3d" }}>

                  <div className="text-2xl sm:text-3xl font-black text-[#88A85D]" style={{ fontFamily: "var(--font-heading)" }}>100%</div>
                  <div className="text-xs sm:text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>Natural Ingredients</div>
                </motion.div>
                <div className="w-px h-12 bg-[#E85D75]/20"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="card-3d"
                  style={{ transformStyle: "preserve-3d" }}>

                  <div className="text-2xl sm:text-3xl font-black text-[#F4A261]" style={{ fontFamily: "var(--font-heading)" }}>4.9★</div>
                  <div className="text-xs sm:text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>Customer Rating</div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block perspective-container"
              aria-hidden="true">

              <div className="relative w-full h-[600px]" style={{ transformStyle: "preserve-3d" }}>
                {/* 3D Floating Product Images */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 15, 0],
                    rotateX: [0, 5, 0],
                    z: [0, 40, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 w-72 h-72 rounded-[2.5rem] overflow-hidden shadow-3d border-4 border-white"
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}>

                  <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9d2d2ddf-ef37-4248-823b-3b54ced81af7/generated_images/professional-food-photography-of-freshly-94dc6b3d-20251104165350.jpg"
                    alt=""
                    className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4A5D4]/10 to-transparent pointer-events-none" />
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotateY: [0, -15, 0],
                    rotateX: [0, -5, 0],
                    z: [0, 30, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-0 left-0 w-80 h-80 rounded-[2.5rem] overflow-hidden shadow-3d border-4 border-white"
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}>

                  <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9d2d2ddf-ef37-4248-823b-3b54ced81af7/generated_images/professional-food-photography-of-rich-ra-a9b6abe8-20251104163351.jpg"
                    alt=""
                    className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-br from-[#89CFF0]/10 to-transparent pointer-events-none" />
                </motion.div>
                
                {/* 3D Floating Badge - Updated with Mocha Mousse */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateZ: [0, 5, -5, 0]
                  }}
                  transition={{
                    opacity: { delay: 1.2, type: "spring" },
                    scale: { delay: 1.2, type: "spring" },
                    rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-3d p-6 border-4 border-[#A67C52]"
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(60px) translate(-50%, -50%)" }}
                  whileHover={{ scale: 1.1, rotateZ: 0 }}>

                  <div className="text-center">
                    <div className="text-3xl font-black text-[#E85D75]" style={{ fontFamily: "var(--font-heading)" }}>100%</div>
                    <div className="text-xs font-bold text-[#A67C52]" style={{ fontFamily: "var(--font-accent)" }}>Natural</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 3D Decorative Elements - Updated with 2025 gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.08, 0.05],
              rotateZ: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl"
            style={{
              transformStyle: "preserve-3d",
              background: "linear-gradient(135deg, #E85D75, #D4A5D4)"
            }} />

          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.05, 0.08, 0.05],
              rotateZ: [360, 180, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl"
            style={{
              transformStyle: "preserve-3d",
              background: "linear-gradient(135deg, #F4A261, #A67C52)"
            }} />

        </div>
      </section>

      {/* Products Section with Enhanced Cards */}
      <section className="py-24 bg-[#FAFAF8] paper-texture">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
              Our <span className="text-[#E85D75]">Health-First</span> Delights
            </h2>
            <p className="text-xl text-[#5D4037]/70 max-w-2xl mx-auto mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Handcrafted with ancient grains & modern nutrition. Contact us to learn more about pricing and availability.
            </p>
            
            {/* Filter Buttons with 3D effect - Updated with 2025 colors */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
              { id: "all", label: "All Products" },
              { id: "high-protein", label: "High Protein" },
              { id: "high-fiber", label: "High Fiber" },
              { id: "sugar-free", label: "Low Sugar" },
              { id: "general", label: "Classic" }].
              map((filter) =>
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all btn-3d ${
                activeFilter === filter.id ?
                "bg-[#E85D75] text-white shadow-3d" :
                "bg-white text-[#5D4037] hover:bg-[#FAF0E6] border border-[#E85D75]/20"}`
                }
                style={{ fontFamily: "var(--font-accent)" }}>

                  {filter.label}
                </motion.button>
              )}
            </div>
          </motion.div>
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-2 animate-pulse">
                  <div className="h-80 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  layout>
                  <Card className="group overflow-hidden border-2 border-transparent hover:border-[#E85D75] transition-all duration-300 hover:shadow-3d bg-white rounded-3xl card-3d">
                    <div className="relative h-80 overflow-hidden">
                      <div 
                        onClick={() => setQuickViewProduct(product)}
                        className="cursor-pointer w-full h-full"
                      >
                        <motion.img
                        whileHover={{ scale: 1.15, rotateZ: 2 }}
                        transition={{ duration: 0.5 }}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        style={{ transformStyle: "preserve-3d" }} />
                      </div>
                        <motion.div
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}>
                          <span className="bg-[#F4A261] text-[#2C2C2E] text-xs font-bold px-3 py-1.5 rounded-full shadow-3d" style={{ fontFamily: "var(--font-accent)" }}>
                            {product.badge}
                          </span>
                        </motion.div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-[#88A85D] font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-accent)" }}>
                        {product.category}
                      </p>
                      
                      <Link href={`/products/${product.id}`} className="cursor-pointer">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#E85D75] transition-colors text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) ?
                                "fill-[#F4A261] text-[#F4A261]" :
                                "text-[#E8E5E1]"}`
                              } />
                          ))}
                        </div>
                        <span className="text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      {/* Action Buttons Row - All Inline */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleExpressInterest(product);
                          }}
                          disabled={addingToWishlist}
                          className="flex-1 bg-[#E85D75] hover:bg-[#E85D75]/90 text-white rounded-full btn-3d cursor-pointer"
                          style={{ fontFamily: "var(--font-accent)" }}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {addingToWishlist ? "Adding..." : "Interested"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
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
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12">

            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#F4A261] hover:bg-[#E27D60] text-[#2C2C2E] font-bold group shadow-3d rounded-full px-8 btn-3d"
                style={{ fontFamily: "var(--font-accent)" }}>

                View All Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && pendingProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSignupModal(false);
                setPendingProduct(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 flex items-center justify-center"
            >
              <Card className="w-full max-w-md bg-white rounded-3xl shadow-3d p-8">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowSignupModal(false);
                      setPendingProduct(null);
                    }}
                    className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#E85D75] to-[#F4A261] flex items-center justify-center shadow-3d">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-black text-center mb-3 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                    Save Your Interests!
                  </h3>
                  
                  <p className="text-center text-[#5D4037]/70 mb-6 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Create an account to save <span className="font-bold text-[#E85D75]">{pendingProduct.name}</span> and other products you're interested in. We'll keep you updated on availability and special offers!
                  </p>
                  
                  {/* Product Preview */}
                  <div className="bg-[#FAF0E6] rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <img
                      src={pendingProduct.image}
                      alt={pendingProduct.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                        {pendingProduct.name}
                      </p>
                      <p className="text-xs text-[#5D4037]/60">{pendingProduct.category}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      onClick={() => {
                        router.push(`/register?redirect=${encodeURIComponent(window.location.pathname)}&product=${pendingProduct.id}`);
                      }}
                      className="w-full bg-[#E85D75] hover:bg-[#E85D75]/90 text-white font-bold rounded-full btn-3d"
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}&product=${pendingProduct.id}`);
                      }}
                      className="w-full border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white font-bold rounded-full"
                      style={{ fontFamily: "var(--font-accent)" }}
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Already Have Account
                    </Button>
                    
                    <button
                      onClick={() => {
                        setShowSignupModal(false);
                        setPendingProduct(null);
                        toast.info("You can sign up anytime to save your interests!");
                      }}
                      className="text-sm text-[#5D4037]/60 hover:text-[#5D4037] transition-colors py-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Continue without account
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

            
            {/* Modal */}
            <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 sm:inset-10 md:inset-20 z-50 flex items-center justify-center">

              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-3d">
                <div className="relative">
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full">

                    <X className="w-5 h-5" />
                  </Button>
                  
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Product Image */}
                    <div className="relative h-96 md:h-full rounded-2xl overflow-hidden">
                      <img
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-cover" />

                      <div className="absolute top-4 left-4">
                        <span className="bg-[#F4A261] text-[#2C2C2E] text-sm font-bold px-4 py-2 rounded-full shadow-3d">
                          {quickViewProduct.badge}
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex flex-col">
                      <p className="text-sm text-[#88A85D] font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-accent)" }}>
                        {quickViewProduct.category}
                      </p>
                      
                      <h2 className="text-3xl font-black mb-3 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                        {quickViewProduct.name}
                      </h2>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) =>
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                          i < Math.floor(quickViewProduct.rating) ?
                          "fill-[#F4A261] text-[#F4A261]" :
                          "text-[#E8E5E1]"}`
                          } />

                        )}
                        </div>
                        <span className="text-sm text-[#5D4037]/60 font-medium">
                          {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                        </span>
                      </div>
                      
                      <p className="text-[#5D4037]/70 mb-6 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {quickViewProduct.description}
                      </p>
                      
                      {/* Nutrition Info */}
                      <div className="bg-[#FAF0E6] rounded-2xl p-4 mb-6">
                        <h4 className="font-bold text-[#2C2C2E] mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                          Nutritional Info (per serving)
                        </h4>
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div>
                            <p className="text-lg font-black text-[#E85D75]" style={{ fontFamily: "var(--font-heading)" }}>
                              {quickViewProduct.nutrition.protein}
                            </p>
                            <p className="text-xs text-[#5D4037]/60">Protein</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#88A85D]" style={{ fontFamily: "var(--font-heading)" }}>
                              {quickViewProduct.nutrition.carbs}
                            </p>
                            <p className="text-xs text-[#5D4037]/60">Carbs</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#F4A261]" style={{ fontFamily: "var(--font-heading)" }}>
                              {quickViewProduct.nutrition.fat}
                            </p>
                            <p className="text-xs text-[#5D4037]/60">Fat</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#A67C52]" style={{ fontFamily: "var(--font-heading)" }}>
                              {quickViewProduct.nutrition.calories}
                            </p>
                            <p className="text-xs text-[#5D4037]/60">Calories</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3 mt-auto">
                        <Button
                          size="lg"
                          onClick={() => handleExpressInterest(quickViewProduct)}
                          disabled={addingToWishlist}
                          className="flex-1 bg-[#E85D75] hover:bg-[#E85D75]/90 text-white font-bold rounded-full btn-3d"
                          style={{ fontFamily: "var(--font-accent)" }}>

                          <Heart className="w-5 h-5 mr-2" />
                          {addingToWishlist ? "Adding..." : "I'm Interested"}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          asChild
                          className="border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white font-bold rounded-full"
                          style={{ fontFamily: "var(--font-accent)" }}>

                          <Link href={`/products/${quickViewProduct.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Benefits Section - Updated with Mocha Mousse */}
      <section className="py-24 bg-[#5D4037] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why Choose <span className="text-[#F4A261]">Geetato?</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Commitment to quality, tradition, and your wellbeing
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-container">
            {benefits.map((benefit, idx) =>
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
              style={{ transformStyle: "preserve-3d" }}>

                <motion.div
                whileHover={{ scale: 1.15, rotateY: 10, rotateZ: 5 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#E85D75] via-[#F4A261] to-[#A67C52] flex items-center justify-center shadow-3d"
                style={{ transformStyle: "preserve-3d" }}>

                  <benefit.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>{benefit.title}</h3>
                <p className="text-white/80" style={{ fontFamily: "var(--font-body)" }}>{benefit.description}</p>
              </motion.div>
            )}
          </div>
          
          {/* Certifications with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-16 border-t border-white/20">

            <div className="flex flex-wrap justify-center items-center gap-12 perspective-container">
              {certifications.map((cert, idx) =>
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, rotateY: 15, z: 20 }}
                className="flex flex-col items-center gap-3"
                style={{ transformStyle: "preserve-3d" }}>

                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-3d">
                    <cert.icon className="w-8 h-8 text-[#F4A261]" />
                  </div>
                  <span className="text-sm font-bold text-white/90" style={{ fontFamily: "var(--font-accent)" }}>{cert.name}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section with 3D Cards - Updated with Lavender tones */}
      <section className="py-24 bg-gradient-to-br from-[#FAF0E6] via-[#FAFAF8] to-[#D4A5D4]/10 paper-texture">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
              What Our <span className="text-[#E85D75]">Customers Say</span>
            </h2>
            <p className="text-xl text-[#5D4037]/70 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Real stories from real people who love our delights
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 perspective-container">
            {testimonials.map((testimonial, idx) =>
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12, rotateX: 5 }}
              style={{ transformStyle: "preserve-3d" }}>

                <Card className="p-8 bg-white border-2 border-transparent hover:border-[#E85D75] transition-all duration-300 shadow-3d rounded-3xl card-3d">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.img
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-[#E85D75] shadow-3d" />

                    <div>
                      <h4 className="font-bold text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>{testimonial.name}</h4>
                      <p className="text-sm text-[#5D4037]/60" style={{ fontFamily: "var(--font-body)" }}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) =>
                  <Star key={star} className="w-4 h-4 fill-[#F4A261] text-[#F4A261]" />
                  )}
                  </div>
                  <p className="text-[#5D4037]/80 leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>
                    "{testimonial.quote}"
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* NEW: Customer Photos Gallery */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="text-[#E85D75]">#GeetatoMoments</span> from Our Community
            </h2>
            <p className="text-xl text-[#5D4037]/70 max-w-2xl mx-auto mb-6" style={{ fontFamily: "var(--font-body)" }}>
              See how our customers enjoy their healthy snacking journey
            </p>
            <Button
              asChild
              variant="outline"
              className="border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white font-bold rounded-full btn-3d"
              style={{ fontFamily: "var(--font-accent)" }}>

              <a href="https://instagram.com/geetato" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4 mr-2" />
                Follow @geetato
              </a>
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 perspective-container">
            {customerPhotos.map((photo, idx) =>
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, rotateZ: 2, y: -8 }}
              className="relative group cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}>

                <div className="aspect-square rounded-2xl overflow-hidden shadow-3d border-2 border-white">
                  <img
                  src={photo.image}
                  alt={photo.username}
                  className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: "var(--font-accent)" }}>
                      {photo.username}
                    </p>
                    <p className="text-white/90 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                      {photo.caption}
                    </p>
                  </div>
                </div>
                <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-3d">

                  <Camera className="w-4 h-4 text-[#E85D75]" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* NEW: Instagram Feed Preview */}
      <section className="py-24 bg-gradient-to-br from-[#FAFAF8] via-[#89CFF0]/5 to-[#D4A5D4]/5 paper-texture">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <motion.div
              className="inline-flex items-center gap-2 bg-[#E85D75]/10 text-[#E85D75] px-4 py-2 rounded-full mb-6 font-semibold text-sm border border-[#E85D75]/30 shadow-3d"
              whileHover={{ scale: 1.05 }}
              style={{ fontFamily: "var(--font-accent)" }}>

              <Instagram className="w-4 h-4" />
              Follow Our Journey
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
              Fresh from <span className="text-[#E85D75]">Instagram</span>
            </h2>
            <p className="text-xl text-[#5D4037]/70 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Behind-the-scenes, new products, health tips & customer stories
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {instagramPosts.map((post, idx) =>
            <motion.a
              key={post.id}
              href="https://instagram.com/geetato"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative block"
              style={{ transformStyle: "preserve-3d" }}>

                <div className="aspect-square rounded-2xl overflow-hidden shadow-3d border-2 border-white">
                  <img
                  src={post.image}
                  alt={`Instagram post ${post.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <motion.svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="white"
                      whileHover={{ rotate: 12 }}>

                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.29-3.86-.8l-.28-.14-2.9.49.49-2.9-.14-.28A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                      </motion.svg>
                      <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>{post.comments}</span>
                    </div>
                  </div>
                </div>
                <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#E85D75] to-[#F4A261] rounded-full flex items-center justify-center shadow-3d">

                  <Instagram className="w-5 h-5 text-white" />
                </motion.div>
              </motion.a>
            )}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#E85D75] to-[#F4A261] hover:from-[#E85D75]/90 hover:to-[#F4A261]/90 text-white font-bold shadow-3d btn-3d"
              style={{ fontFamily: "var(--font-accent)" }}>

              <a href="https://instagram.com/geetato" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 mr-2" />
                Follow for Daily Inspiration
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* B2B Preview Section - Updated with fresh gradient */}
      <section className="py-24 bg-gradient-to-br from-[#FAFAF8] via-[#89CFF0]/5 to-[#FAF0E6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <motion.div
                className="inline-flex items-center gap-2 bg-[#E85D75]/10 text-[#E85D75] px-4 py-2 rounded-full mb-6 font-semibold text-sm border border-[#E85D75]/30 shadow-3d"
                whileHover={{ scale: 1.05 }}
                style={{ fontFamily: "var(--font-accent)" }}>

                <Users className="w-4 h-4" />
                For Businesses & Export
              </motion.div>
              
              <h2 className="text-4xl sm:text-5xl font-black mb-6 text-[#2C2C2E]" style={{ fontFamily: "var(--font-heading)" }}>
                Bulk Orders & <span className="text-[#E85D75]">Global Export</span>
              </h2>
              
              <p className="text-xl text-[#5D4037]/80 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Partner with Geetato for corporate gifting, office pantries, 
                retail partnerships, and international export. Premium quality at scale.
              </p>
              
              <div className="space-y-4 mb-8">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}>

                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-[#F4A261] flex items-center justify-center flex-shrink-0 shadow-3d"
                    whileHover={{ scale: 1.1, rotateZ: 10 }}>

                    <Package className="w-6 h-6 text-[#2C2C2E]" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2E] mb-1" style={{ fontFamily: "var(--font-heading)" }}>Custom Packaging</h4>
                    <p className="text-[#5D4037]/70" style={{ fontFamily: "var(--font-body)" }}>Branded packaging options for corporate gifts & retail</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}>

                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-[#E85D75] flex items-center justify-center flex-shrink-0 shadow-3d"
                    whileHover={{ scale: 1.1, rotateZ: -10 }}>

                    <Globe className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2E] mb-1" style={{ fontFamily: "var(--font-heading)" }}>Global Export</h4>
                    <p className="text-[#5D4037]/70" style={{ fontFamily: "var(--font-body)" }}>Certified for international markets with proven track record</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/b2b-solutions">
                  <Button
                    size="lg"
                    className="bg-[#E85D75] hover:bg-[#E85D75]/90 text-white font-bold group shadow-3d rounded-full btn-3d"
                    style={{ fontFamily: "var(--font-accent)" }}>

                    Explore B2B Solutions
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#E85D75] text-[#E85D75] hover:bg-[#E85D75] hover:text-white font-bold rounded-full btn-3d"
                    style={{ fontFamily: "var(--font-accent)" }}>

                    Get a Sample
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              className="relative perspective-container"
              style={{ transformStyle: "preserve-3d" }}>

              <motion.div
                className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-3d"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.5 }}>

                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                  alt="B2B Solutions"
                  className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#E85D75]/30 via-transparent to-[#A67C52]/10" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section with 3D Hover */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center">

            <p className="text-[#5D4037]/60 font-semibold mb-8 uppercase tracking-wide text-sm" style={{ fontFamily: "var(--font-accent)" }}>Available on leading platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-12 perspective-container">
              {partners.map((partner, idx) =>
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  color: "#E85D75",
                  y: -5,
                  rotateZ: 2
                }}
                className="text-2xl font-bold text-[#5D4037]/40 hover:text-[#E85D75] transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-heading)", transformStyle: "preserve-3d" }}>

                  {partner}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}