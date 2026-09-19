import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
    }
    // Optionally: check the product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product.length) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Get all images for this product, primary first
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder), asc(productImages.id));

    return NextResponse.json(
      { total: images.length, images },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products/[id]/images error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
