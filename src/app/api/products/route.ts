import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, or, and, asc, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const healthGoal = searchParams.get('healthGoal');

    let query = db.select().from(products);

    const conditions = [eq(products.is_active, 1)];

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.category, `%${search}%`),
          like(products.health_goal, `%${search}%`)
        )!
      );
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (healthGoal) {
      conditions.push(eq(products.health_goal, healthGoal));
    }

    query = query.where(and(...conditions));

    const results = await query
      .orderBy(asc(products.sort_order), desc(products.created_at))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    if (!session.user.email.includes('admin')) {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      category,
      imageUrl,
      badge,
      healthGoal,
      rating,
      reviewsCount,
      description,
      protein,
      carbs,
      fat,
      calories,
      isActive,
      sortOrder,
    } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Slug is required', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    if (!imageUrl || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required', code: 'MISSING_IMAGE_URL' },
        { status: 400 }
      );
    }

    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug.trim()))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: 'A product with this slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 409 }
      );
    }

    const newProduct = await db
      .insert(products)
      .values({
        name: name.trim(),
        slug: slug.trim(),
        category: category ? category.trim() : null,
        imageUrl: imageUrl.trim(),
        badge: badge ? badge.trim() : null,
        healthGoal: healthGoal ? healthGoal.trim() : null,
        rating: rating ? rating.trim() : null,
        reviewsCount: reviewsCount ?? 0,
        description: description ? description.trim() : null,
        protein: protein ? protein.trim() : null,
        carbs: carbs ? carbs.trim() : null,
        fat: fat ? fat.trim() : null,
        calories: calories ? calories.trim() : null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}