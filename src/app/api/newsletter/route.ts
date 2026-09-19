import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscriptions } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences, userId } = body;

    // Validate required field
    if (!email) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingSubscription = await db.select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, normalizedEmail))
      .limit(1);

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0];

      // If already subscribed, return 409
      if (subscription.subscribed) {
        return NextResponse.json({ 
          error: "Email already subscribed to newsletter",
          code: "ALREADY_SUBSCRIBED" 
        }, { status: 409 });
      }

      // If previously unsubscribed, resubscribe
      const updateData: any = {
        subscribed: true,
        unsubscribedAt: null,
        updatedAt: new Date()
      };

      if (preferences) {
        updateData.preferences = JSON.stringify(preferences);
      }

      const resubscribed = await db.update(newsletterSubscriptions)
        .set(updateData)
        .where(eq(newsletterSubscriptions.id, subscription.id))
        .returning();

      return NextResponse.json(resubscribed[0], { status: 201 });
    }

    // Create new subscription
    const insertData: any = {
      email: normalizedEmail,
      subscribed: true,
      createdAt: new Date()
    };

    if (userId) {
      insertData.userId = userId;
    }

    if (preferences) {
      insertData.preferences = JSON.stringify(preferences);
    }

    const newSubscription = await db.insert(newsletterSubscriptions)
      .values(insertData)
      .returning();

    return NextResponse.json(newSubscription[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: "AUTHENTICATION_REQUIRED" 
      }, { status: 401 });
    }

    // Admin check
    if (!session.user.email.includes('admin')) {
      return NextResponse.json({ 
        error: 'Admin access required',
        code: "ADMIN_ACCESS_REQUIRED" 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const subscribedParam = searchParams.get('subscribed');

    let query = db.select().from(newsletterSubscriptions);

    // Filter by subscribed status
    if (subscribedParam !== null) {
      const subscribedValue = subscribedParam === 'true';
      query = query.where(eq(newsletterSubscriptions.subscribed, subscribedValue));
    }

    // Order by created_at DESC with pagination
    const results = await query
      .orderBy(desc(newsletterSubscriptions.created_at))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle unsubscribe action
    if (action === 'unsubscribe' || request.url.includes('/unsubscribe')) {
      const body = await request.json();
      const { email } = body;

      // Validate required field
      if (!email) {
        return NextResponse.json({ 
          error: "Email is required",
          code: "MISSING_EMAIL" 
        }, { status: 400 });
      }

      // Normalize email to lowercase
      const normalizedEmail = email.trim().toLowerCase();

      // Find subscription by email
      const subscription = await db.select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, normalizedEmail))
        .limit(1);

      if (subscription.length === 0) {
        return NextResponse.json({ 
          error: "Email not found in subscriptions",
          code: "EMAIL_NOT_FOUND" 
        }, { status: 404 });
      }

      // Update subscription status
      await db.update(newsletterSubscriptions)
        .set({
          subscribed: false,
          unsubscribedAt: new Date()
        })
        .where(eq(newsletterSubscriptions.id, subscription[0].id));

      return NextResponse.json({ 
        message: "Successfully unsubscribed from newsletter" 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      error: "Invalid action",
      code: "INVALID_ACTION" 
    }, { status: 400 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}