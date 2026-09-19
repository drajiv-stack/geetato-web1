import fs from 'fs';
import path from 'path';

const productsDir = path.resolve('public/images/products');

// Product list copied from src/db/seeds/products_user_list.ts
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

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractDescription(fileName: string): string {
  const base = path.basename(fileName, '.jpg');
  const match = base.match(/professional-food-photography-of-(.+)-[a-f0-9]{8}-\d{14}$/);
  return match ? match[1].replace(/-/g, ' ') : base;
}

function scoreMatch(productName: string, description: string): number {
  const prodWords = slugify(productName).split('-').filter(w => w.length > 1);
  const descWords = new Set(description.toLowerCase().split(/[-\s]+/).filter(w => w.length > 1));
  let score = 0;
  for (const word of prodWords) {
    if (descWords.has(word)) score += 1;
    // Partial match bonus for longer words
    for (const descWord of descWords) {
      if (descWord.length >= 4 && (descWord.startsWith(word) || word.startsWith(descWord))) {
        score += 0.5;
      }
    }
  }
  return score;
}

function main() {
  const files = fs.readdirSync(productsDir)
    .filter(f => f.endsWith('.jpg'))
    .map(f => path.join(productsDir, f));

  const usedFiles = new Set<string>();
  const plan: { name: string; slug: string; file: string | null }[] = [];

  for (const product of userProductList) {
    const slug = slugify(product.name);
    let bestFile: string | null = null;
    let bestScore = -1;

    for (const file of files) {
      if (usedFiles.has(file)) continue;
      const desc = extractDescription(file);
      const score = scoreMatch(product.name, desc);
      if (score > bestScore) {
        bestScore = score;
        bestFile = file;
      }
    }

    if (bestFile) {
      usedFiles.add(bestFile);
      const newPath = path.join(productsDir, `${slug}.jpg`);
      fs.renameSync(bestFile, newPath);
      plan.push({ name: product.name, slug, file: path.basename(newPath) });
    } else {
      plan.push({ name: product.name, slug, file: null });
    }
  }

  console.log('Matched images:');
  for (const p of plan) {
    console.log(`  ${p.name} -> ${p.file ?? 'NO IMAGE'}`);
  }
}

main();
