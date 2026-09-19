import { db } from '@/db';
import { products, productImages, productNutrition, productIngredients, productHighlights } from '@/db/schema';

async function main() {
    // Updated products data from provided list
    const sampleProducts = [
        // Health-Focused Bakery - Sugar-Free Treats
        {
            name: 'Sugar-Free Almond Cookies',
            slug: 'sugar-free-almond-cookies',
            category: 'Health-Focused Bakery',
            subCategory: 'Sugar-Free Treats',
            description: 'Delicious almond cookies sweetened with stevia, perfect for health-conscious individuals. Made with premium almond flour and zero added sugar, these cookies offer a guilt-free indulgence with a rich, nutty flavor.',
            badge: 'Sugar-Free',
            featured: true,
            rating: 4.8,
            reviews: 456,
        },
        {
            name: 'Sugar-Free Brownies',
            slug: 'sugar-free-brownies',
            category: 'Health-Focused Bakery',
            subCategory: 'Sugar-Free Treats',
            description: 'Rich, fudgy brownies made with dark chocolate and sweetened naturally. Indulge in the decadent chocolate flavor without the sugar guilt. Perfect for dessert lovers watching their sugar intake.',
            badge: 'Best Seller',
            featured: true,
            rating: 4.9,
            reviews: 623,
        },
        // Health-Focused Bakery - High-Fiber Options
        {
            name: 'High-Fiber Oat Bars',
            slug: 'high-fiber-oat-bars',
            category: 'Health-Focused Bakery',
            subCategory: 'High-Fiber Options',
            description: 'Wholesome oat bars packed with fiber from whole grains and flaxseeds. These bars keep you satisfied longer and support digestive health with 8g of fiber per serving.',
            badge: 'High Fiber',
            featured: false,
            rating: 4.7,
            reviews: 389,
        },
        // Health-Focused Bakery - Diabetic-Friendly
        {
            name: 'Diabetic-Friendly Millet Cookies',
            slug: 'diabetic-friendly-millet-cookies',
            category: 'Health-Focused Bakery',
            subCategory: 'Diabetic-Friendly',
            description: 'Specially crafted cookies using millet flour and natural sweeteners with low glycemic index. Perfect for diabetics who want to enjoy a sweet treat without blood sugar spikes.',
            badge: 'Diabetic Friendly',
            featured: false,
            rating: 4.6,
            reviews: 287,
        },
        // Health-Focused Bakery - Gluten-Free
        {
            name: 'Gluten-Free Ragi Crackers',
            slug: 'gluten-free-ragi-crackers',
            category: 'Health-Focused Bakery',
            subCategory: 'Gluten-Free',
            description: 'Crispy crackers made from 100% ragi (finger millet) flour. Naturally gluten-free and rich in calcium and iron. Perfect for snacking or pairing with dips.',
            badge: 'Gluten-Free',
            featured: false,
            rating: 4.5,
            reviews: 312,
        },
        // Ancient Grains Collection - Quinoa Products
        {
            name: 'Quinoa Energy Bites',
            slug: 'quinoa-energy-bites',
            category: 'Ancient Grains Collection',
            subCategory: 'Quinoa Products',
            description: 'Protein-packed energy bites made with puffed quinoa, dates, and nuts. These bite-sized snacks provide sustained energy and complete protein from quinoa.',
            badge: 'High Protein',
            featured: true,
            rating: 4.8,
            reviews: 534,
        },
        {
            name: 'Quinoa Granola Bars',
            slug: 'quinoa-granola-bars',
            category: 'Ancient Grains Collection',
            subCategory: 'Quinoa Products',
            description: 'Crunchy granola bars featuring quinoa, oats, and honey. A perfect breakfast or mid-day snack with ancient grain goodness and natural sweetness.',
            badge: 'New',
            featured: false,
            rating: 4.7,
            reviews: 198,
        },
        // Ancient Grains Collection - Ragi Products
        {
            name: 'Ragi Finger Cookies',
            slug: 'ragi-finger-cookies',
            category: 'Ancient Grains Collection',
            subCategory: 'Ragi Products',
            description: 'Traditional finger millet cookies with a modern twist. High in calcium and iron, these cookies are both nutritious and delicious with a unique earthy flavor.',
            badge: 'Best Seller',
            featured: true,
            rating: 4.8,
            reviews: 672,
        },
        // Ancient Grains Collection - Amaranth Products
        {
            name: 'Amaranth Protein Bars',
            slug: 'amaranth-protein-bars',
            category: 'Ancient Grains Collection',
            subCategory: 'Amaranth Products',
            description: 'Power-packed protein bars with amaranth seeds and nuts. Rich in complete protein and amino acids, ideal for post-workout recovery or active lifestyles.',
            badge: 'High Protein',
            featured: false,
            rating: 4.7,
            reviews: 421,
        },
        // Ancient Grains Collection - Buckwheat Products
        {
            name: 'Buckwheat Crackers',
            slug: 'buckwheat-crackers',
            category: 'Ancient Grains Collection',
            subCategory: 'Buckwheat Products',
            description: 'Gluten-free buckwheat crackers with herbs and seeds. Light, crispy, and packed with nutrients from this ancient pseudo-grain.',
            badge: 'Gluten-Free',
            featured: false,
            rating: 4.6,
            reviews: 256,
        },
        // Vegan Options - Plant-Based Treats
        {
            name: 'Vegan Chocolate Chip Cookies',
            slug: 'vegan-chocolate-chip-cookies',
            category: 'Vegan Options',
            subCategory: 'Plant-Based Treats',
            description: 'Classic chocolate chip cookies made entirely plant-based. No eggs, no dairy, but all the deliciousness. Made with coconut oil and dairy-free chocolate chips.',
            badge: 'Vegan',
            featured: true,
            rating: 4.9,
            reviews: 789,
        },
        {
            name: 'Coconut Almond Bars',
            slug: 'coconut-almond-bars',
            category: 'Vegan Options',
            subCategory: 'Plant-Based Treats',
            description: 'Tropical coconut bars with crunchy almonds. 100% plant-based and naturally sweetened with dates. A perfect combination of flavors and textures.',
            badge: 'Vegan',
            featured: false,
            rating: 4.7,
            reviews: 367,
        },
        // Vegan Options - Energy Bites
        {
            name: 'Date & Nut Energy Balls',
            slug: 'date-nut-energy-balls',
            category: 'Vegan Options',
            subCategory: 'Energy Bites',
            description: 'Raw energy balls made with dates, mixed nuts, and cacao. No-bake, naturally sweet, and packed with sustained energy for your busy day.',
            badge: 'Vegan',
            featured: false,
            rating: 4.8,
            reviews: 512,
        },
        {
            name: 'Peanut Butter Energy Squares',
            slug: 'peanut-butter-energy-squares',
            category: 'Vegan Options',
            subCategory: 'Energy Bites',
            description: 'Protein-rich energy squares with natural peanut butter and oats. Perfect pre or post-workout snack with no refined sugars.',
            badge: 'High Protein',
            featured: false,
            rating: 4.7,
            reviews: 445,
        },
        // Vegan Options - Protein Snacks
        {
            name: 'Cashew Protein Bites',
            slug: 'cashew-protein-bites',
            category: 'Vegan Options',
            subCategory: 'Protein Snacks',
            description: 'Creamy cashew-based protein bites with chia seeds. Plant-based protein powerhouse that satisfies sweet cravings while supporting muscle recovery.',
            badge: 'High Protein',
            featured: false,
            rating: 4.6,
            reviews: 334,
        },
        // Kids' Healthy Treats - Lunchbox Favorites
        {
            name: 'Veggie-Packed Mini Muffins',
            slug: 'veggie-packed-mini-muffins',
            category: "Kids' Healthy Treats",
            subCategory: 'Lunchbox Favorites',
            description: 'Colorful mini muffins with hidden vegetables. Kids love them, parents love the nutrition. Made with carrots, zucchini, and whole wheat flour.',
            badge: 'New',
            featured: true,
            rating: 4.8,
            reviews: 567,
        },
        {
            name: 'Chocolate Oat Cookies',
            slug: 'chocolate-oat-cookies',
            category: "Kids' Healthy Treats",
            subCategory: 'Lunchbox Favorites',
            description: 'Kid-friendly chocolate cookies made with whole oats and dark chocolate. Healthier option for chocolate lovers with added fiber and less sugar.',
            badge: 'Best Seller',
            featured: false,
            rating: 4.9,
            reviews: 723,
        },
        {
            name: 'Banana Bread Bites',
            slug: 'banana-bread-bites',
            category: "Kids' Healthy Treats",
            subCategory: 'Lunchbox Favorites',
            description: 'Moist banana bread bites naturally sweetened with ripe bananas. Made with whole wheat flour and walnuts for added nutrition.',
            badge: 'New',
            featured: false,
            rating: 4.7,
            reviews: 412,
        },
        // Kids' Healthy Treats - Hidden Veggie Options
        {
            name: 'Carrot Cake Cookies',
            slug: 'carrot-cake-cookies',
            category: "Kids' Healthy Treats",
            subCategory: 'Hidden Veggie Options',
            description: 'Delicious cookies with the classic carrot cake flavor. Packed with shredded carrots, raisins, and warm spices. A healthier way to enjoy cake.',
            badge: 'New',
            featured: false,
            rating: 4.6,
            reviews: 298,
        },
        // Kids' Healthy Treats - Fun Shapes
        {
            name: 'Beetroot Brownies',
            slug: 'beetroot-brownies',
            category: "Kids' Healthy Treats",
            subCategory: 'Fun Shapes',
            description: 'Fudgy brownies with hidden beetroot for extra nutrition and moisture. Rich chocolate flavor masks the veggies perfectly. Fun purple color too!',
            badge: 'New',
            featured: false,
            rating: 4.8,
            reviews: 389,
        },
    ];

    // Insert products and get their IDs
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    
    // Product images data
    const productImagesData = [
        // Sugar-Free Almond Cookies
        { productId: insertedProducts[0].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/almond-cookies-1.jpg', altText: 'Sugar-Free Almond Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[0].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/almond-cookies-2.jpg', altText: 'Almond Cookies Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[0].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/almond-cookies-3.jpg', altText: 'Almond Cookies Stack', displayOrder: 3, isPrimary: false },
        
        // Sugar-Free Brownies
        { productId: insertedProducts[1].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/brownies-1.jpg', altText: 'Sugar-Free Brownies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[1].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/brownies-2.jpg', altText: 'Fudgy Brownies Slice', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[1].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/brownies-3.jpg', altText: 'Brownies Texture', displayOrder: 3, isPrimary: false },
        
        // High-Fiber Oat Bars
        { productId: insertedProducts[2].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/oat-bars-1.jpg', altText: 'High-Fiber Oat Bars', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[2].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/oat-bars-2.jpg', altText: 'Oat Bars Closeup', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[2].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/oat-bars-3.jpg', altText: 'Oat Bars Stack', displayOrder: 3, isPrimary: false },
        
        // Diabetic-Friendly Millet Cookies
        { productId: insertedProducts[3].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/millet-cookies-1.jpg', altText: 'Millet Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[3].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/millet-cookies-2.jpg', altText: 'Millet Cookies Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[3].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/millet-cookies-3.jpg', altText: 'Millet Cookies Plate', displayOrder: 3, isPrimary: false },
        
        // Gluten-Free Ragi Crackers
        { productId: insertedProducts[4].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-crackers-1.jpg', altText: 'Ragi Crackers', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[4].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-crackers-2.jpg', altText: 'Ragi Crackers Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[4].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-crackers-3.jpg', altText: 'Ragi Crackers Bowl', displayOrder: 3, isPrimary: false },
        
        // Quinoa Energy Bites
        { productId: insertedProducts[5].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-bites-1.jpg', altText: 'Quinoa Energy Bites', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[5].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-bites-2.jpg', altText: 'Energy Bites Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[5].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-bites-3.jpg', altText: 'Quinoa Bites Bowl', displayOrder: 3, isPrimary: false },
        
        // Quinoa Granola Bars
        { productId: insertedProducts[6].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-granola-1.jpg', altText: 'Quinoa Granola Bars', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[6].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-granola-2.jpg', altText: 'Granola Bars Stack', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[6].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/quinoa-granola-3.jpg', altText: 'Granola Bars Texture', displayOrder: 3, isPrimary: false },
        
        // Ragi Finger Cookies
        { productId: insertedProducts[7].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-fingers-1.jpg', altText: 'Ragi Finger Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[7].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-fingers-2.jpg', altText: 'Ragi Fingers Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[7].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/ragi-fingers-3.jpg', altText: 'Ragi Fingers Plated', displayOrder: 3, isPrimary: false },
        
        // Amaranth Protein Bars
        { productId: insertedProducts[8].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/amaranth-bars-1.jpg', altText: 'Amaranth Protein Bars', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[8].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/amaranth-bars-2.jpg', altText: 'Protein Bars Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[8].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/amaranth-bars-3.jpg', altText: 'Amaranth Bars Stack', displayOrder: 3, isPrimary: false },
        
        // Buckwheat Crackers
        { productId: insertedProducts[9].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/buckwheat-crackers-1.jpg', altText: 'Buckwheat Crackers', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[9].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/buckwheat-crackers-2.jpg', altText: 'Crackers Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[9].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/buckwheat-crackers-3.jpg', altText: 'Buckwheat Crackers Spread', displayOrder: 3, isPrimary: false },
        
        // Vegan Chocolate Chip Cookies
        { productId: insertedProducts[10].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/vegan-choc-chip-1.jpg', altText: 'Vegan Chocolate Chip Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[10].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/vegan-choc-chip-2.jpg', altText: 'Vegan Cookies Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[10].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/vegan-choc-chip-3.jpg', altText: 'Chocolate Chip Stack', displayOrder: 3, isPrimary: false },
        
        // Coconut Almond Bars
        { productId: insertedProducts[11].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/coconut-almond-1.jpg', altText: 'Coconut Almond Bars', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[11].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/coconut-almond-2.jpg', altText: 'Coconut Bars Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[11].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/coconut-almond-3.jpg', altText: 'Almond Bars Stack', displayOrder: 3, isPrimary: false },
        
        // Date & Nut Energy Balls
        { productId: insertedProducts[12].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/date-nut-balls-1.jpg', altText: 'Date & Nut Energy Balls', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[12].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/date-nut-balls-2.jpg', altText: 'Energy Balls Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[12].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/date-nut-balls-3.jpg', altText: 'Date Balls Bowl', displayOrder: 3, isPrimary: false },
        
        // Peanut Butter Energy Squares
        { productId: insertedProducts[13].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/pb-squares-1.jpg', altText: 'Peanut Butter Energy Squares', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[13].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/pb-squares-2.jpg', altText: 'PB Squares Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[13].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/pb-squares-3.jpg', altText: 'Energy Squares Stack', displayOrder: 3, isPrimary: false },
        
        // Cashew Protein Bites
        { productId: insertedProducts[14].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/cashew-bites-1.jpg', altText: 'Cashew Protein Bites', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[14].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/cashew-bites-2.jpg', altText: 'Cashew Bites Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[14].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/cashew-bites-3.jpg', altText: 'Protein Bites Bowl', displayOrder: 3, isPrimary: false },
        
        // Veggie-Packed Mini Muffins
        { productId: insertedProducts[15].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/veggie-muffins-1.jpg', altText: 'Veggie-Packed Mini Muffins', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[15].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/veggie-muffins-2.jpg', altText: 'Mini Muffins Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[15].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/veggie-muffins-3.jpg', altText: 'Veggie Muffins Basket', displayOrder: 3, isPrimary: false },
        
        // Chocolate Oat Cookies
        { productId: insertedProducts[16].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/choc-oat-cookies-1.jpg', altText: 'Chocolate Oat Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[16].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/choc-oat-cookies-2.jpg', altText: 'Oat Cookies Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[16].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/choc-oat-cookies-3.jpg', altText: 'Chocolate Cookies Stack', displayOrder: 3, isPrimary: false },
        
        // Banana Bread Bites
        { productId: insertedProducts[17].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/banana-bites-1.jpg', altText: 'Banana Bread Bites', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[17].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/banana-bites-2.jpg', altText: 'Banana Bites Close-up', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[17].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/banana-bites-3.jpg', altText: 'Banana Bites Plated', displayOrder: 3, isPrimary: false },
        
        // Carrot Cake Cookies
        { productId: insertedProducts[18].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/carrot-cookies-1.jpg', altText: 'Carrot Cake Cookies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[18].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/carrot-cookies-2.jpg', altText: 'Carrot Cookies Detail', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[18].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/carrot-cookies-3.jpg', altText: 'Carrot Cookies Stack', displayOrder: 3, isPrimary: false },
        
        // Beetroot Brownies
        { productId: insertedProducts[19].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/beetroot-brownies-1.jpg', altText: 'Beetroot Brownies', displayOrder: 1, isPrimary: true },
        { productId: insertedProducts[19].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/beetroot-brownies-2.jpg', altText: 'Beetroot Brownies Slice', displayOrder: 2, isPrimary: false },
        { productId: insertedProducts[19].id, imageUrl: 'https://qcvhocsgjohxpwbhfvyf.supabase.co/storage/v1/object/public/products/beetroot-brownies-3.jpg', altText: 'Beetroot Brownies Plated', displayOrder: 3, isPrimary: false },
    ];

    await db.insert(productImages).values(productImagesData);

    // Product nutrition data
    const nutritionData = [
        { productId: insertedProducts[0].id, servingSize: '3 cookies (45g)', calories: 180, protein: 6.5, carbs: 18, fat: 10, fiber: 3.5, sugar: 2 },
        { productId: insertedProducts[1].id, servingSize: '1 brownie (60g)', calories: 220, protein: 5, carbs: 25, fat: 12, fiber: 4, sugar: 3 },
        { productId: insertedProducts[2].id, servingSize: '1 bar (55g)', calories: 185, protein: 5.5, carbs: 28, fat: 6, fiber: 8, sugar: 8 },
        { productId: insertedProducts[3].id, servingSize: '4 cookies (50g)', calories: 170, protein: 4, carbs: 24, fat: 7, fiber: 3, sugar: 4 },
        { productId: insertedProducts[4].id, servingSize: '8 crackers (40g)', calories: 150, protein: 4.5, carbs: 22, fat: 5, fiber: 4.5, sugar: 1 },
        { productId: insertedProducts[5].id, servingSize: '5 bites (45g)', calories: 195, protein: 7, carbs: 20, fat: 9, fiber: 3, sugar: 10 },
        { productId: insertedProducts[6].id, servingSize: '1 bar (60g)', calories: 210, protein: 6, carbs: 30, fat: 8, fiber: 5, sugar: 12 },
        { productId: insertedProducts[7].id, servingSize: '4 cookies (50g)', calories: 175, protein: 5, carbs: 26, fat: 6, fiber: 4, sugar: 6 },
        { productId: insertedProducts[8].id, servingSize: '1 bar (55g)', calories: 225, protein: 10, carbs: 22, fat: 11, fiber: 5, sugar: 7 },
        { productId: insertedProducts[9].id, servingSize: '10 crackers (45g)', calories: 160, protein: 5, carbs: 23, fat: 5.5, fiber: 4, sugar: 2 },
        { productId: insertedProducts[10].id, servingSize: '3 cookies (48g)', calories: 200, protein: 4, carbs: 26, fat: 9, fiber: 2.5, sugar: 11 },
        { productId: insertedProducts[11].id, servingSize: '1 bar (50g)', calories: 190, protein: 5, carbs: 20, fat: 10, fiber: 4, sugar: 9 },
        { productId: insertedProducts[12].id, servingSize: '4 balls (45g)', calories: 180, protein: 5.5, carbs: 22, fat: 8, fiber: 4.5, sugar: 12 },
        { productId: insertedProducts[13].id, servingSize: '2 squares (55g)', calories: 215, protein: 8, carbs: 24, fat: 10, fiber: 3.5, sugar: 8 },
        { productId: insertedProducts[14].id, servingSize: '5 bites (50g)', calories: 205, protein: 9, carbs: 18, fat: 12, fiber: 3, sugar: 6 },
        { productId: insertedProducts[15].id, servingSize: '3 muffins (60g)', calories: 165, protein: 4.5, carbs: 25, fat: 5, fiber: 3.5, sugar: 7 },
        { productId: insertedProducts[16].id, servingSize: '3 cookies (45g)', calories: 185, protein: 4, carbs: 27, fat: 7, fiber: 3, sugar: 10 },
        { productId: insertedProducts[17].id, servingSize: '4 bites (50g)', calories: 170, protein: 4, carbs: 28, fat: 5, fiber: 2.5, sugar: 11 },
        { productId: insertedProducts[18].id, servingSize: '3 cookies (48g)', calories: 175, protein: 3.5, carbs: 26, fat: 6, fiber: 3, sugar: 9 },
        { productId: insertedProducts[19].id, servingSize: '1 brownie (55g)', calories: 195, protein: 4.5, carbs: 24, fat: 9, fiber: 4, sugar: 8 },
    ];

    await db.insert(productNutrition).values(nutritionData);

    // Product ingredients data
    const ingredientsData = [
        // Sugar-Free Almond Cookies
        { productId: insertedProducts[0].id, ingredientName: 'Almond flour', displayOrder: 1 },
        { productId: insertedProducts[0].id, ingredientName: 'Stevia', displayOrder: 2 },
        { productId: insertedProducts[0].id, ingredientName: 'Coconut oil', displayOrder: 3 },
        { productId: insertedProducts[0].id, ingredientName: 'Vanilla extract', displayOrder: 4 },
        { productId: insertedProducts[0].id, ingredientName: 'Baking powder', displayOrder: 5 },
        
        // Sugar-Free Brownies
        { productId: insertedProducts[1].id, ingredientName: 'Dark chocolate (85%)', displayOrder: 1 },
        { productId: insertedProducts[1].id, ingredientName: 'Whole wheat flour', displayOrder: 2 },
        { productId: insertedProducts[1].id, ingredientName: 'Erythritol', displayOrder: 3 },
        { productId: insertedProducts[1].id, ingredientName: 'Eggs', displayOrder: 4 },
        { productId: insertedProducts[1].id, ingredientName: 'Butter', displayOrder: 5 },
        { productId: insertedProducts[1].id, ingredientName: 'Cocoa powder', displayOrder: 6 },
        
        // High-Fiber Oat Bars
        { productId: insertedProducts[2].id, ingredientName: 'Whole oats', displayOrder: 1 },
        { productId: insertedProducts[2].id, ingredientName: 'Flaxseeds', displayOrder: 2 },
        { productId: insertedProducts[2].id, ingredientName: 'Chia seeds', displayOrder: 3 },
        { productId: insertedProducts[2].id, ingredientName: 'Honey', displayOrder: 4 },
        { productId: insertedProducts[2].id, ingredientName: 'Almonds', displayOrder: 5 },
        { productId: insertedProducts[2].id, ingredientName: 'Dates', displayOrder: 6 },
        
        // Diabetic-Friendly Millet Cookies
        { productId: insertedProducts[3].id, ingredientName: 'Millet flour', displayOrder: 1 },
        { productId: insertedProducts[3].id, ingredientName: 'Jaggery powder', displayOrder: 2 },
        { productId: insertedProducts[3].id, ingredientName: 'Ghee', displayOrder: 3 },
        { productId: insertedProducts[3].id, ingredientName: 'Cardamom', displayOrder: 4 },
        { productId: insertedProducts[3].id, ingredientName: 'Almonds', displayOrder: 5 },
        
        // Gluten-Free Ragi Crackers
        { productId: insertedProducts[4].id, ingredientName: 'Ragi flour', displayOrder: 1 },
        { productId: insertedProducts[4].id, ingredientName: 'Sesame seeds', displayOrder: 2 },
        { productId: insertedProducts[4].id, ingredientName: 'Olive oil', displayOrder: 3 },
        { productId: insertedProducts[4].id, ingredientName: 'Black pepper', displayOrder: 4 },
        { productId: insertedProducts[4].id, ingredientName: 'Sea salt', displayOrder: 5 },
        
        // Quinoa Energy Bites
        { productId: insertedProducts[5].id, ingredientName: 'Puffed quinoa', displayOrder: 1 },
        { productId: insertedProducts[5].id, ingredientName: 'Dates', displayOrder: 2 },
        { productId: insertedProducts[5].id, ingredientName: 'Mixed nuts', displayOrder: 3 },
        { productId: insertedProducts[5].id, ingredientName: 'Cacao powder', displayOrder: 4 },
        { productId: insertedProducts[5].id, ingredientName: 'Coconut oil', displayOrder: 5 },
        
        // Quinoa Granola Bars
        { productId: insertedProducts[6].id, ingredientName: 'Quinoa', displayOrder: 1 },
        { productId: insertedProducts[6].id, ingredientName: 'Rolled oats', displayOrder: 2 },
        { productId: insertedProducts[6].id, ingredientName: 'Honey', displayOrder: 3 },
        { productId: insertedProducts[6].id, ingredientName: 'Dried cranberries', displayOrder: 4 },
        { productId: insertedProducts[6].id, ingredientName: 'Sunflower seeds', displayOrder: 5 },
        { productId: insertedProducts[6].id, ingredientName: 'Coconut flakes', displayOrder: 6 },
        
        // Ragi Finger Cookies
        { productId: insertedProducts[7].id, ingredientName: 'Ragi flour', displayOrder: 1 },
        { productId: insertedProducts[7].id, ingredientName: 'Whole wheat flour', displayOrder: 2 },
        { productId: insertedProducts[7].id, ingredientName: 'Jaggery', displayOrder: 3 },
        { productId: insertedProducts[7].id, ingredientName: 'Butter', displayOrder: 4 },
        { productId: insertedProducts[7].id, ingredientName: 'Sesame seeds', displayOrder: 5 },
        
        // Amaranth Protein Bars
        { productId: insertedProducts[8].id, ingredientName: 'Amaranth seeds', displayOrder: 1 },
        { productId: insertedProducts[8].id, ingredientName: 'Cashews', displayOrder: 2 },
        { productId: insertedProducts[8].id, ingredientName: 'Almonds', displayOrder: 3 },
        { productId: insertedProducts[8].id, ingredientName: 'Dates', displayOrder: 4 },
        { productId: insertedProducts[8].id, ingredientName: 'Peanut butter', displayOrder: 5 },
        { productId: insertedProducts[8].id, ingredientName: 'Chia seeds', displayOrder: 6 },
        
        // Buckwheat Crackers
        { productId: insertedProducts[9].id, ingredientName: 'Buckwheat flour', displayOrder: 1 },
        { productId: insertedProducts[9].id, ingredientName: 'Flaxseeds', displayOrder: 2 },
        { productId: insertedProducts[9].id, ingredientName: 'Rosemary', displayOrder: 3 },
        { productId: insertedProducts[9].id, ingredientName: 'Olive oil', displayOrder: 4 },
        { productId: insertedProducts[9].id, ingredientName: 'Sea salt', displayOrder: 5 },
        
        // Vegan Chocolate Chip Cookies
        { productId: insertedProducts[10].id, ingredientName: 'Whole wheat flour', displayOrder: 1 },
        { productId: insertedProducts[10].id, ingredientName: 'Coconut oil', displayOrder: 2 },
        { productId: insertedProducts[10].id, ingredientName: 'Dairy-free chocolate chips', displayOrder: 3 },
        { productId: insertedProducts[10].id, ingredientName: 'Coconut sugar', displayOrder: 4 },
        { productId: insertedProducts[10].id, ingredientName: 'Flax eggs', displayOrder: 5 },
        { productId: insertedProducts[10].id, ingredientName: 'Vanilla extract', displayOrder: 6 },
        
        // Coconut Almond Bars
        { productId: insertedProducts[11].id, ingredientName: 'Shredded coconut', displayOrder: 1 },
        { productId: insertedProducts[11].id, ingredientName: 'Almonds', displayOrder: 2 },
        { productId: insertedProducts[11].id, ingredientName: 'Dates', displayOrder: 3 },
        { productId: insertedProducts[11].id, ingredientName: 'Coconut oil', displayOrder: 4 },
        { productId: insertedProducts[11].id, ingredientName: 'Maple syrup', displayOrder: 5 },
        
        // Date & Nut Energy Balls
        { productId: insertedProducts[12].id, ingredientName: 'Medjool dates', displayOrder: 1 },
        { productId: insertedProducts[12].id, ingredientName: 'Mixed nuts', displayOrder: 2 },
        { productId: insertedProducts[12].id, ingredientName: 'Cacao powder', displayOrder: 3 },
        { productId: insertedProducts[12].id, ingredientName: 'Vanilla extract', displayOrder: 4 },
        { productId: insertedProducts[12].id, ingredientName: 'Sea salt', displayOrder: 5 },
        
        // Peanut Butter Energy Squares
        { productId: insertedProducts[13].id, ingredientName: 'Natural peanut butter', displayOrder: 1 },
        { productId: insertedProducts[13].id, ingredientName: 'Rolled oats', displayOrder: 2 },
        { productId: insertedProducts[13].id, ingredientName: 'Honey', displayOrder: 3 },
        { productId: insertedProducts[13].id, ingredientName: 'Chia seeds', displayOrder: 4 },
        { productId: insertedProducts[13].id, ingredientName: 'Dark chocolate chips', displayOrder: 5 },
        
        // Cashew Protein Bites
        { productId: insertedProducts[14].id, ingredientName: 'Cashews', displayOrder: 1 },
        { productId: insertedProducts[14].id, ingredientName: 'Dates', displayOrder: 2 },
        { productId: insertedProducts[14].id, ingredientName: 'Chia seeds', displayOrder: 3 },
        { productId: insertedProducts[14].id, ingredientName: 'Coconut oil', displayOrder: 4 },
        { productId: insertedProducts[14].id, ingredientName: 'Vanilla protein powder', displayOrder: 5 },
        { productId: insertedProducts[14].id, ingredientName: 'Coconut flakes', displayOrder: 6 },
        
        // Veggie-Packed Mini Muffins
        { productId: insertedProducts[15].id, ingredientName: 'Whole wheat flour', displayOrder: 1 },
        { productId: insertedProducts[15].id, ingredientName: 'Grated carrots', displayOrder: 2 },
        { productId: insertedProducts[15].id, ingredientName: 'Grated zucchini', displayOrder: 3 },
        { productId: insertedProducts[15].id, ingredientName: 'Eggs', displayOrder: 4 },
        { productId: insertedProducts[15].id, ingredientName: 'Honey', displayOrder: 5 },
        { productId: insertedProducts[15].id, ingredientName: 'Coconut oil', displayOrder: 6 },
        
        // Chocolate Oat Cookies
        { productId: insertedProducts[16].id, ingredientName: 'Rolled oats', displayOrder: 1 },
        { productId: insertedProducts[16].id, ingredientName: 'Whole wheat flour', displayOrder: 2 },
        { productId: insertedProducts[16].id, ingredientName: 'Dark chocolate chips', displayOrder: 3 },
        { productId: insertedProducts[16].id, ingredientName: 'Honey', displayOrder: 4 },
        { productId: insertedProducts[16].id, ingredientName: 'Butter', displayOrder: 5 },
        
        // Banana Bread Bites
        { productId: insertedProducts[17].id, ingredientName: 'Ripe bananas', displayOrder: 1 },
        { productId: insertedProducts[17].id, ingredientName: 'Whole wheat flour', displayOrder: 2 },
        { productId: insertedProducts[17].id, ingredientName: 'Walnuts', displayOrder: 3 },
        { productId: insertedProducts[17].id, ingredientName: 'Eggs', displayOrder: 4 },
        { productId: insertedProducts[17].id, ingredientName: 'Honey', displayOrder: 5 },
        { productId: insertedProducts[17].id, ingredientName: 'Cinnamon', displayOrder: 6 },
        
        // Carrot Cake Cookies
        { productId: insertedProducts[18].id, ingredientName: 'Grated carrots', displayOrder: 1 },
        { productId: insertedProducts[18].id, ingredientName: 'Whole wheat flour', displayOrder: 2 },
        { productId: insertedProducts[18].id, ingredientName: 'Raisins', displayOrder: 3 },
        { productId: insertedProducts[18].id, ingredientName: 'Cinnamon', displayOrder: 4 },
        { productId: insertedProducts[18].id, ingredientName: 'Honey', displayOrder: 5 },
        { productId: insertedProducts[18].id, ingredientName: 'Coconut oil', displayOrder: 6 },
        
        // Beetroot Brownies
        { productId: insertedProducts[19].id, ingredientName: 'Beetroot puree', displayOrder: 1 },
        { productId: insertedProducts[19].id, ingredientName: 'Dark chocolate', displayOrder: 2 },
        { productId: insertedProducts[19].id, ingredientName: 'Whole wheat flour', displayOrder: 3 },
        { productId: insertedProducts[19].id, ingredientName: 'Cocoa powder', displayOrder: 4 },
        { productId: insertedProducts[19].id, ingredientName: 'Honey', displayOrder: 5 },
        { productId: insertedProducts[19].id, ingredientName: 'Eggs', displayOrder: 6 },
    ];

    await db.insert(productIngredients).values(ingredientsData);

    // Product highlights data
    const highlightsData = [
        // Sugar-Free Almond Cookies
        { productId: insertedProducts[0].id, highlightText: 'Zero Added Sugar', displayOrder: 1 },
        { productId: insertedProducts[0].id, highlightText: 'High in Protein', displayOrder: 2 },
        { productId: insertedProducts[0].id, highlightText: 'Rich in Healthy Fats', displayOrder: 3 },
        { productId: insertedProducts[0].id, highlightText: 'Gluten-Free Option', displayOrder: 4 },
        { productId: insertedProducts[0].id, highlightText: 'Diabetic Friendly', displayOrder: 5 },
        
        // Sugar-Free Brownies
        { productId: insertedProducts[1].id, highlightText: 'Zero Added Sugar', displayOrder: 1 },
        { productId: insertedProducts[1].id, highlightText: 'Rich in Antioxidants', displayOrder: 2 },
        { productId: insertedProducts[1].id, highlightText: 'High in Fiber', displayOrder: 3 },
        { productId: insertedProducts[1].id, highlightText: 'No Artificial Sweeteners', displayOrder: 4 },
        
        // High-Fiber Oat Bars
        { productId: insertedProducts[2].id, highlightText: 'High in Fiber (8g)', displayOrder: 1 },
        { productId: insertedProducts[2].id, highlightText: 'Supports Digestive Health', displayOrder: 2 },
        { productId: insertedProducts[2].id, highlightText: 'Long-Lasting Energy', displayOrder: 3 },
        { productId: insertedProducts[2].id, highlightText: 'Rich in Omega-3', displayOrder: 4 },
        { productId: insertedProducts[2].id, highlightText: 'Heart Healthy', displayOrder: 5 },
        
        // Diabetic-Friendly Millet Cookies
        { productId: insertedProducts[3].id, highlightText: 'Low Glycemic Index', displayOrder: 1 },
        { productId: insertedProducts[3].id, highlightText: 'Diabetic Friendly', displayOrder: 2 },
        { productId: insertedProducts[3].id, highlightText: 'Ancient Grain Goodness', displayOrder: 3 },
        { productId: insertedProducts[3].id, highlightText: 'Naturally Sweetened', displayOrder: 4 },
        
        // Gluten-Free Ragi Crackers
        { productId: insertedProducts[4].id, highlightText: 'Gluten-Free', displayOrder: 1 },
        { productId: insertedProducts[4].id, highlightText: 'High in Calcium', displayOrder: 2 },
        { productId: insertedProducts[4].id, highlightText: 'Rich in Iron', displayOrder: 3 },
        { productId: insertedProducts[4].id, highlightText: 'Low in Sugar', displayOrder: 4 },
        { productId: insertedProducts[4].id, highlightText: 'Perfect for Snacking', displayOrder: 5 },
        
        // Quinoa Energy Bites
        { productId: insertedProducts[5].id, highlightText: 'Complete Protein Source', displayOrder: 1 },
        { productId: insertedProducts[5].id, highlightText: 'Sustained Energy Release', displayOrder: 2 },
        { productId: insertedProducts[5].id, highlightText: 'Ancient Grain Superfood', displayOrder: 3 },
        { productId: insertedProducts[5].id, highlightText: 'Natural Energy Boost', displayOrder: 4 },
        
        // Quinoa Granola Bars
        { productId: insertedProducts[6].id, highlightText: 'Whole Grain Goodness', displayOrder: 1 },
        { productId: insertedProducts[6].id, highlightText: 'High in Fiber', displayOrder: 2 },
        { productId: insertedProducts[6].id, highlightText: 'Natural Sweetness', displayOrder: 3 },
        { productId: insertedProducts[6].id, highlightText: 'Perfect Breakfast Option', displayOrder: 4 },
        
        // Ragi Finger Cookies
        { productId: insertedProducts[7].id, highlightText: 'High in Calcium', displayOrder: 1 },
        { productId: insertedProducts[7].id, highlightText: 'Rich in Iron', displayOrder: 2 },
        { productId: insertedProducts[7].id, highlightText: 'Traditional Recipe', displayOrder: 3 },
        { productId: insertedProducts[7].id, highlightText: 'Naturally Nutritious', displayOrder: 4 },
        { productId: insertedProducts[7].id, highlightText: 'Low Glycemic Index', displayOrder: 5 },
        
        // Amaranth Protein Bars
        { productId: insertedProducts[8].id, highlightText: 'High in Protein (10g)', displayOrder: 1 },
        { productId: insertedProducts[8].id, highlightText: 'Complete Amino Acids', displayOrder: 2 },
        { productId: insertedProducts[8].id, highlightText: 'Post-Workout Recovery', displayOrder: 3 },
        { productId: insertedProducts[8].id, highlightText: 'Ancient Grain Power', displayOrder: 4 },
        
        // Buckwheat Crackers
        { productId: insertedProducts[9].id, highlightText: 'Gluten-Free', displayOrder: 1 },
        { productId: insertedProducts[9].id, highlightText: 'Heart Healthy', displayOrder: 2 },
        { productId: insertedProducts[9].id, highlightText: 'Rich in Antioxidants', displayOrder: 3 },
        { productId: insertedProducts[9].id, highlightText: 'Low in Sugar', displayOrder: 4 },
        
        // Vegan Chocolate Chip Cookies
        { productId: insertedProducts[10].id, highlightText: '100% Plant-Based', displayOrder: 1 },
        { productId: insertedProducts[10].id, highlightText: 'No Dairy or Eggs', displayOrder: 2 },
        { productId: insertedProducts[10].id, highlightText: 'Cruelty-Free', displayOrder: 3 },
        { productId: insertedProducts[10].id, highlightText: 'Classic Taste', displayOrder: 4 },
        { productId: insertedProducts[10].id, highlightText: 'Whole Grain', displayOrder: 5 },
        
        // Coconut Almond Bars
        { productId: insertedProducts[11].id, highlightText: '100% Vegan', displayOrder: 1 },
        { productId: insertedProducts[11].id, highlightText: 'Naturally Sweetened', displayOrder: 2 },
        { productId: insertedProducts[11].id, highlightText: 'Tropical Flavor', displayOrder: 3 },
        { productId: insertedProducts[11].id, highlightText: 'Healthy Fats', displayOrder: 4 },
        
        // Date & Nut Energy Balls
        { productId: insertedProducts[12].id, highlightText: 'No-Bake Recipe', displayOrder: 1 },
        { productId: insertedProducts[12].id, highlightText: '100% Vegan', displayOrder: 2 },
        { productId: insertedProducts[12].id, highlightText: 'Natural Energy', displayOrder: 3 },
        { productId: insertedProducts[12].id, highlightText: 'Rich in Minerals', displayOrder: 4 },
        { productId: insertedProducts[12].id, highlightText: 'No Refined Sugar', displayOrder: 5 },
        
        // Peanut Butter Energy Squares
        { productId: insertedProducts[13].id, highlightText: 'High in Protein', displayOrder: 1 },
        { productId: insertedProducts[13].id, highlightText: 'Pre-Workout Fuel', displayOrder: 2 },
        { productId: insertedProducts[13].id, highlightText: 'Natural Ingredients', displayOrder: 3 },
        { productId: insertedProducts[13].id, highlightText: 'Sustained Energy', displayOrder: 4 },
        
        // Cashew Protein Bites
        { productId: insertedProducts[14].id, highlightText: 'High in Protein', displayOrder: 1 },
        { productId: insertedProducts[14].id, highlightText: '100% Plant-Based', displayOrder: 2 },
        { productId: insertedProducts[14].id, highlightText: 'Muscle Recovery', displayOrder: 3 },
        { productId: insertedProducts[14].id, highlightText: 'Creamy Texture', displayOrder: 4 },
        
        // Veggie-Packed Mini Muffins
        { productId: insertedProducts[15].id, highlightText: 'Hidden Vegetables', displayOrder: 1 },
        { productId: insertedProducts[15].id, highlightText: 'Kid-Friendly', displayOrder: 2 },
        { productId: insertedProducts[15].id, highlightText: 'Lunchbox Perfect', displayOrder: 3 },
        { productId: insertedProducts[15].id, highlightText: 'Naturally Sweetened', displayOrder: 4 },
        { productId: insertedProducts[15].id, highlightText: 'Whole Grain', displayOrder: 5 },
        
        // Chocolate Oat Cookies
        { productId: insertedProducts[16].id, highlightText: 'High in Fiber', displayOrder: 1 },
        { productId: insertedProducts[16].id, highlightText: 'Kid-Approved', displayOrder: 2 },
        { productId: insertedProducts[16].id, highlightText: 'Whole Grain Goodness', displayOrder: 3 },
        { productId: insertedProducts[16].id, highlightText: 'Chocolate Flavor', displayOrder: 4 },
        
        // Banana Bread Bites
        { productId: insertedProducts[17].id, highlightText: 'Naturally Sweetened', displayOrder: 1 },
        { productId: insertedProducts[17].id, highlightText: 'Rich in Potassium', displayOrder: 2 },
        { productId: insertedProducts[17].id, highlightText: 'Moist & Delicious', displayOrder: 3 },
        { productId: insertedProducts[17].id, highlightText: 'Whole Wheat', displayOrder: 4 },
        
        // Carrot Cake Cookies
        { productId: insertedProducts[18].id, highlightText: 'Hidden Veggies', displayOrder: 1 },
        { productId: insertedProducts[18].id, highlightText: 'Classic Flavor', displayOrder: 2 },
        { productId: insertedProducts[18].id, highlightText: 'Naturally Sweetened', displayOrder: 3 },
        { productId: insertedProducts[18].id, highlightText: 'Rich in Beta-Carotene', displayOrder: 4 },
        
        // Beetroot Brownies
        { productId: insertedProducts[19].id, highlightText: 'Hidden Vegetables', displayOrder: 1 },
        { productId: insertedProducts[19].id, highlightText: 'Rich Chocolate Flavor', displayOrder: 2 },
        { productId: insertedProducts[19].id, highlightText: 'Natural Food Coloring', displayOrder: 3 },
        { productId: insertedProducts[19].id, highlightText: 'Extra Moisture', displayOrder: 4 },
        { productId: insertedProducts[19].id, highlightText: 'High in Fiber', displayOrder: 5 },
    ];

    await db.insert(productHighlights).values(highlightsData);

    console.log('✅ Products comprehensive seeder completed successfully');
    console.log(`   - ${insertedProducts.length} products created`);
    console.log(`   - ${productImagesData.length} product images created`);
    console.log(`   - ${nutritionData.length} nutrition records created`);
    console.log(`   - ${ingredientsData.length} ingredients created`);
    console.log(`   - ${highlightsData.length} highlights created`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});