import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, code, slug, description, posterUrl, price, year, ageRating, status, episodeInfo, subType, rating, featured, categoryIds } = body;

    const product = await db.product.update({
      where: { id },
      data: {
        title,
        code: code || null,
        slug,
        description: description || null,
        posterUrl: posterUrl || null,
        price: price || null,
        year: year || null,
        ageRating: ageRating || null,
        status: status || 'available',
        episodeInfo: episodeInfo || null,
        subType: subType || null,
        rating: rating || null,
        featured: featured || false,
        categories: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId: string) => ({ categoryId })),
            }
          : undefined,
      },
      include: { categories: { include: { category: true } } },
    });

    return NextResponse.json(product);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
