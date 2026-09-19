import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Search
    const search = searchParams.get('search');
    
    // Filters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Build query
    let query = db.select().from(products);
    
    // Apply filters
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.category, `%${search}%`),
          like(products.subCategory, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }
    
    if (category) {
      conditions.push(eq(products.category, category));
    }
    
    if (featured !== null && featured !== undefined) {
      conditions.push(eq(products.featured, featured === 'true' ? 1 : 0));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting and pagination
    const results = await query
      .orderBy(desc(products.created_at))
      .limit(limit)
      .offset(offset);

    // Map database fields to API response format
    const mappedResults = results.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      badge: product.badge,
      featured: !!product.featured,
      rating: typeof product.rating === 'string' ? parseFloat(product.rating) || 0 : Number(product.rating) || 0,
      reviews: Number(product.reviews) || 0,
      imageUrl: product.image_url,
      image_url: product.image_url,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
      calories: product.calories,
      healthGoal: product.health_goal,
      price: product.price,
      weight: product.weight,
      availability: product.availability,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return NextResponse.json(mappedResults, { status: 200 });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    // Check admin access
    const userEmail = session.user?.email;
    if (!userEmail || !userEmail.includes('admin')) {
      return NextResponse.json(
        { 
          error: 'Admin access required',
          code: 'ADMIN_ACCESS_REQUIRED'
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, category, subCategory, description, badge, featured, rating, reviews } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Name is required and must be a non-empty string',
          code: 'MISSING_NAME'
        },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Slug is required and must be a non-empty string',
          code: 'MISSING_SLUG'
        },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Category is required and must be a non-empty string',
          code: 'MISSING_CATEGORY'
        },
        { status: 400 }
      );
    }

    if (!subCategory || typeof subCategory !== 'string' || subCategory.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Sub-category is required and must be a non-empty string',
          code: 'MISSING_SUB_CATEGORY'
        },
        { status: 400 }
      );
    }

    // Validate slug is URL-safe
    const urlSafePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!urlSafePattern.test(slug.trim())) {
      return NextResponse.json(
        { 
          error: 'Slug must be URL-safe (lowercase letters, numbers, and hyphens only)',
          code: 'INVALID_SLUG_FORMAT'
        },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.slug, slug.trim()))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { 
          error: 'Product with this slug already exists',
          code: 'DUPLICATE_SLUG'
        },
        { status: 409 }
      );
    }

    // Validate optional fields
    if (featured !== undefined && typeof featured !== 'boolean') {
      return NextResponse.json(
        { 
          error: 'Featured must be a boolean value',
          code: 'INVALID_FEATURED'
        },
        { status: 400 }
      );
    }

    if (rating !== undefined && (typeof rating !== 'number' || rating < 0)) {
      return NextResponse.json(
        { 
          error: 'Rating must be a non-negative number',
          code: 'INVALID_RATING'
        },
        { status: 400 }
      );
    }

    if (reviews !== undefined && (typeof reviews !== 'number' || !Number.isInteger(reviews) || reviews < 0)) {
      return NextResponse.json(
        { 
          error: 'Reviews must be a non-negative integer',
          code: 'INVALID_REVIEWS'
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      name: name.trim(),
      slug: slug.trim(),
      category: category.trim(),
      subCategory: subCategory.trim(),
      description: description ? description.trim() : null,
      badge: badge ? badge.trim() : null,
      featured: featured ?? false,
      rating: rating ?? 0,
      reviews: reviews ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert product
    const newProduct = await db.insert(products)
      .values(insertData)
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST products error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}