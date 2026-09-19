import { db } from '@/db';
import { products } from '@/db/schema';

async function main() {
    // Transform user's product list to match actual database schema
    const transformProduct = (product: any, index: number) => {
        const slug = product.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
        return {
            name: product.name,
            slug: slug,
            category: product.category,
            image_url: `/images/products/${slug}.jpg`,
            badge: product.tag,
            health_goal: product.category.toLowerCase().includes('sugar') || product.category.toLowerCase().includes('diabetic') ? 'sugar-free' :
                        (product.category.toLowerCase().includes('fiber') ? 'high-fiber' :
                        (product.category.toLowerCase().includes('protein') ? 'high-protein' : 'general')),
            rating: '4.5',
            reviews_count: Math.floor(Math.random() * 200) + 50,
            description: `${product.name} - A delicious ${product.category.toLowerCase()} treat from our ${product.tag} collection.`,
            protein: product.category.toLowerCase().includes('protein') ? '8g' : '2g',
            carbs: '20g',
            fat: '5g',
            calories: '150',
            is_active: true,
            sort_order: index + 1,
            created_at: new Date(),
            updated_at: new Date(),
            subCategory: product.tag, // Required field
            featured: product.category.toLowerCase().includes('best seller') || product.category.toLowerCase().includes('premium') ? 1 : 0,
            price: Math.floor(Math.random() * 500) + 50, // Random price between 50-550
            weight: '250g', // Default weight
            availability: 'in-stock',
            reviews: Math.floor(Math.random() * 200) + 50, // Duplicate of reviews_count
            tags: product.tag,
            health_tags: product.category.toLowerCase().includes('sugar') || product.category.toLowerCase().includes('diabetic') ? 'sugar-free,diabetic-friendly' :
                        product.category.toLowerCase().includes('fiber') ? 'high-fiber,digestive-health' :
                        product.category.toLowerCase().includes('protein') ? 'high-protein,fitness' : 'general',
            dietary_tags: product.category.toLowerCase().includes('gluten') ? 'gluten-free' : 'vegetarian',
            shelf_life_days: 365, // 1 year shelf life
            storage_instructions: 'Store in a cool, dry place',
            serving_size: '30g',
            servings_per_package: 8,
            is_featured: product.category.toLowerCase().includes('best seller') || product.category.toLowerCase().includes('premium') ? 1 : 0,
            is_bestseller: product.category.toLowerCase().includes('best seller') ? 1 : 0,
            is_new_arrival: Math.random() > 0.8 ? 1 : 0, // 20% chance of being new arrival
            available_for_b2b: 1,
            available_for_export: product.category.toLowerCase().includes('premium') ? 1 : 0,
            minimum_order_quantity: 1,
        };
    };

    // User's original product list
    const userProductList = [
        {"name":"Stevia Cookie Pack","category":"Sugar-Free","tag":"Sugar-Free Treats"},
        {"name":"Flax Seed Crackers","category":"Fiber Rich","tag":"High-Fiber Options"},
        {"name":"Millet Flour Cookies","category":"Gluten-Free","tag":"Gluten-Free Selection"},
        {"name":"Jeera Mathri Pack","category":"Classic","tag":"Mathri & Khakhra"},
        {"name":"Spiced Sev Variety","category":"Spicy","tag":"Baked Namkeens"},
        {"name":"Masala Makhana Chips","category":"Premium","tag":"Crackers & Chips"},
        {"name":"Diwali Special Box","category":"Festival","tag":"Festival Specials"},
        {"name":"Garlic Focaccia","category":"Artisan","tag":"Artisan Breads"},
        {"name":"Chocolate Cupcakes","category":"Popular","tag":"Fresh Cakes & Bakes"},
        {"name":"Atta Rusks","category":"Traditional","tag":"Cookies & Rusks"},
        {"name":"Baked Samosas","category":"Savory","tag":"Snacks & Bites"},
        {"name":"Aloo Paratha (5 pack)","category":"Frozen","tag":"Parathas & Rotis"},
        {"name":"Frozen Samosas (10 pack)","category":"Party Pack","tag":"Ready-to-Fry Items"},
        {"name":"Baked Halwa Cups","category":"Sweet","tag":"Frozen Desserts"},
        {"name":"Millet Flour Mix (1kg)","category":"Organic","tag":"Flour Blends"},
        {"name":"Bakery Spice Mix","category":"Special","tag":"Spice Mixes"},
        {"name":"Plant Protein Powder","category":"Fitness","tag":"Health Additives"},
        {"name":"Jaggery Energy Bites","category":"Natural","tag":"Sugar-Free Treats"},
        {"name":"Sugar-Free Brownies","category":"Best Seller","tag":"Sugar-Free Treats"},
        {"name":"Oat & Millet Cookies","category":"High Fiber","tag":"High-Fiber Options"},
        {"name":"Baked Khakhra Variety","category":"Traditional","tag":"High-Fiber Options"},
        {"name":"Savory Snack Box","category":"Low GI","tag":"Diabetic-Friendly Range"},
        {"name":"Multi-Grain Crackers","category":"Diabetic-Safe","tag":"Diabetic-Friendly Range"},
        {"name":"Almond Protein Bars","category":"High Protein","tag":"Gluten-Free Selection"},
        {"name":"Makhana Puffs","category":"Light","tag":"Gluten-Free Selection"},
        {"name":"Masala Khakhra Assorted","category":"Bestseller","tag":"Mathri & Khakhra"},
        {"name":"Methi Mathri","category":"Traditional","tag":"Mathri & Khakhra"},
        {"name":"Roasted Chivda Mix","category":"Crunchy","tag":"Baked Namkeens"},
        {"name":"Puffed Snack Mix","category":"Light","tag":"Baked Namkeens"},
        {"name":"Baked Potato Wafers","category":"Popular","tag":"Crackers & Chips"},
        {"name":"Multigrain Crisps","category":"Healthy","tag":"Crackers & Chips"},
        {"name":"Rajasthani Snack Box","category":"Regional","tag":"Regional Specialties"},
        {"name":"South Indian Murukku","category":"Authentic","tag":"Regional Specialties"},
        {"name":"Punjabi Mix","category":"Spicy","tag":"Regional Specialties"},
        {"name":"Holi Gujiya Pack","category":"Seasonal","tag":"Festival Specials"},
        {"name":"Festive Combo Pack","category":"Gift Box","tag":"Festival Specials"},
        {"name":"Multigrain Bread","category":"Fresh Daily","tag":"Artisan Breads"},
        {"name":"Pav Buns (6 pack)","category":"Best Seller","tag":"Artisan Breads"},
        {"name":"Whole Wheat Cake","category":"Eggless","tag":"Fresh Cakes & Bakes"},
        {"name":"Vanilla Sponge Cake","category":"Premium","tag":"Fresh Cakes & Bakes"},
        {"name":"Coconut Cookies","category":"Classic","tag":"Cookies & Rusks"},
        {"name":"Butter Cookies","category":"Best Seller","tag":"Cookies & Rusks"},
        {"name":"Millet Cookies","category":"Healthy","tag":"Cookies & Rusks"},
        {"name":"Blueberry Muffins","category":"Fresh","tag":"Snacks & Bites"},
        {"name":"Mini Tarts Assorted","category":"Sweet","tag":"Snacks & Bites"},
        {"name":"Plain Roti (10 pack)","category":"Convenient","tag":"Parathas & Rotis"},
        {"name":"Paneer Paratha (5 pack)","category":"Premium","tag":"Parathas & Rotis"},
        {"name":"Veg Cutlets (6 pack)","category":"Quick Fry","tag":"Ready-to-Fry Items"},
        {"name":"Kachori Mix (8 pack)","category":"Traditional","tag":"Ready-to-Fry Items"},
        {"name":"Chapati Dough (500g)","category":"Fresh","tag":"Meal Components"},
        {"name":"Curry Base Mix","category":"Easy Meal","tag":"Meal Components"},
        {"name":"Gravy Cubes","category":"Instant","tag":"Meal Components"},
        {"name":"Frozen Rasmalai","category":"Premium","tag":"Frozen Desserts"},
        {"name":"Gulab Jamun Bites","category":"Classic","tag":"Frozen Desserts"},
        {"name":"Almond Flour (500g)","category":"Premium","tag":"Flour Blends"},
        {"name":"Multigrain Flour (1kg)","category":"Healthy","tag":"Flour Blends"},
        {"name":"Garam Masala Blend","category":"Authentic","tag":"Spice Mixes"},
        {"name":"Chaat Masala","category":"Tangy","tag":"Spice Mixes"},
        {"name":"Chia Seeds (250g)","category":"Superfood","tag":"Health Additives"},
        {"name":"Mixed Dried Fruits","category":"Premium","tag":"Health Additives"},
        {"name":"Cookie Baking Mix","category":"Easy Bake","tag":"Recipe Bases"},
        {"name":"Brownie Premix","category":"Quick","tag":"Recipe Bases"},
        {"name":"Dough Starter Kit","category":"Starter","tag":"Recipe Bases"}
    ];

    // Transform all products to match database schema
    const userProducts = userProductList.map(transformProduct);

    console.log(`Prepared ${userProducts.length} products for seeding`);

    console.log('Seeding products...');

    // Clear existing products first
    await db.delete(products);

    // Insert all products at once
    await db.insert(products).values(userProducts);

    console.log('Products seeded successfully!');
}

main().catch(console.error);
