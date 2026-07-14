import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movie = await db.movie.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    });
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, code, slug, description, posterUrl, folderPath, year, ageRating, status, episodeInfo, subType, rating, featured, categoryIds } = body;

    const movie = await db.movie.update({
      where: { id },
      data: {
        title,
        code: code || null,
        slug,
        description: description || null,
        posterUrl: posterUrl || null,
        folderPath: folderPath || null,
        year: year || null,
        ageRating: ageRating || null,
        status: status || 'completed',
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

    return NextResponse.json(movie);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update movie';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.movie.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}