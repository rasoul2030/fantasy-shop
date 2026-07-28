import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { movies: true } } },
    });
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('FETCH CATEGORIES ERROR:', err);
    return NextResponse.json({ error: 'Failed to fetch categories', detail: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, type } = body;
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }
    const category = await db.category.create({
      data: { name, slug, type: type || 'movie' },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error('CREATE CATEGORY ERROR:', err);
    return NextResponse.json({ error: 'Failed to create category', detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE CATEGORY ERROR:', err);
    return NextResponse.json({ error: 'Failed to delete category', detail: String(err) }, { status: 500 });
  }
}