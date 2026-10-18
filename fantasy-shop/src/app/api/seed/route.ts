import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const categories = [
      { name: 'آرایشی', slug: 'cosmetics', type: 'product' },
      { name: 'عطر', slug: 'perfume', type: 'product' },
      { name: 'اکسسوری', slug: 'accessory', type: 'product' },
      { name: 'لوازم تحریر', slug: 'stationery', type: 'product' },
    ];

    for (const cat of categories) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    return NextResponse.json({ success: true, message: 'دسته‌بندی‌های فانتزی ایجاد شدند', categories });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to seed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}