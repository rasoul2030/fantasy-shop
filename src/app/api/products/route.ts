import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (categorySlug) {
      where.categories = {
        some: { category: { slug: categorySlug } },
      };
    }
    if (search) {
      where.title = { contains: search };
    }
    if (status) {
      where.status = status;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { categories: { include: { category: true } } },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, code, slug, description, posterUrl, price, year, ageRating, status, episodeInfo, subType, rating, featured, categoryIds } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const product = await db.product.create({
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
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId: string) => ({ categoryId })),
            }
          : undefined,
      },
      include: { categories: { include: { category: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
