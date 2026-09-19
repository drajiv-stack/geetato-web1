import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';



// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Wishlist table
export const wishlist = sqliteTable('wishlist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull(),
  productName: text('product_name').notNull(),
  productImage: text('product_image').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// User Preferences table
export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  dietaryPreferences: text('dietary_preferences', { mode: 'json' }),
  healthGoals: text('health_goals', { mode: 'json' }),
  allergies: text('allergies', { mode: 'json' }),
  favoriteCategories: text('favorite_categories', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Quiz Answers table
export const quizAnswers = sqliteTable('quiz_answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  quizType: text('quiz_type').notNull(),
  answers: text('answers', { mode: 'json' }).notNull(),
  results: text('results', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Contact Submissions table
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Corporate Enquiries table
export const corporateEnquiries = sqliteTable('corporate_enquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  contactPerson: text('contact_person').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  enquiryType: text('enquiry_type').notNull(),
  quantityEstimate: text('quantity_estimate'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Newsletter Subscriptions table
export const newsletterSubscriptions = sqliteTable('newsletter_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  subscribed: integer('subscribed', { mode: 'boolean' }).notNull().default(true),
  preferences: text('preferences', { mode: 'json' }),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  unsubscribed_at: integer('unsubscribed_at', { mode: 'timestamp' }),
});

// Products system tables
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  category: text('category'),
  image_url: text('image_url').notNull(),
  badge: text('badge'),
  health_goal: text('health_goal'),
  rating: text('rating'),
  reviews_count: integer('reviews_count').default(0),
  description: text('description'),
  protein: text('protein'),
  carbs: text('carbs'),
  fat: text('fat'),
  calories: text('calories'),
  is_active: integer('is_active').notNull().default(1),
  sort_order: integer('sort_order').default(0),
  created_at: integer('created_at').notNull(),
  updated_at: integer('updated_at').notNull(),
  subCategory: text('sub_category').notNull().default(''),
  featured: integer('featured').notNull().default(0),
  price: real('price').notNull().default(0),
  tags: text('tags'),
  weight: text('weight').notNull().default(''),
  availability: text('availability').notNull().default('in-stock'),
  reviews: integer('reviews').default(0),
  category_id: integer('category_id'),
  health_tags: text('health_tags'),
  dietary_tags: text('dietary_tags'),
  allergen_info: text('allergen_info'),
  shelf_life_days: integer('shelf_life_days'),
  storage_instructions: text('storage_instructions'),
  serving_size: text('serving_size'),
  servings_per_package: integer('servings_per_package'),
  is_featured: integer('is_featured').default(0),
  is_bestseller: integer('is_bestseller').default(0),
  is_new_arrival: integer('is_new_arrival').default(0),
  available_for_b2b: integer('available_for_b2b').default(0),
  available_for_export: integer('available_for_export').default(0),
  minimum_order_quantity: integer('minimum_order_quantity').default(1),
});

export const productImages = sqliteTable('product_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  displayOrder: integer('display_order').default(0).notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const productNutrition = sqliteTable('product_nutrition', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: integer('product_id').notNull().unique().references(() => products.id, { onDelete: 'cascade' }),
  serving_size: text('serving_size').notNull(),
  calories: integer('calories').notNull(),
  protein: real('protein').notNull(),
  carbs: real('carbs').notNull(),
  fat: real('fat').notNull(),
  fiber: real('fiber').notNull(),
  sugar: real('sugar').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const productIngredients = sqliteTable('product_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  ingredientName: text('ingredient_name').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const productHighlights = sqliteTable('product_highlights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  highlightText: text('highlight_text').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Site settings system (update existing table)
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value').notNull(),
  settingType: text('setting_type').notNull().default('text'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Social media system (update existing tables)
export const socialCredentials = sqliteTable('social_credentials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull().unique(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  profileUrl: text('profile_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const instagramPosts = sqliteTable('instagram_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  instagramId: text('instagram_id').unique(),
  caption: text('caption'),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type'),
  permalink: text('permalink'),
  likesCount: integer('likes_count').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  postedAt: integer('posted_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});