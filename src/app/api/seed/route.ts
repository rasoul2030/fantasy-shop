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

    const allCategories = await db.category.findMany();
    const catMap = new Map(allCategories.map(c => [c.slug, c.id]));

    const sampleProducts = [
      {
        title: 'رژ لب مات رز',
        slug: 'rose-matte-lipstick',
        description: 'رژ لب مات با ماندگاری بالا و رنگ‌دهی عالی. مناسب برای استفاده روزانه و مهمانی.',
        posterUrl: 'https://placehold.co/400x565/FFE4E6/EC4899?text=Lipstick',
        price: '۱۸۵,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'اورجینال',
        rating: 8.5,
        featured: true,
        categorySlugs: ['cosmetics'],
      },
      {
        title: 'عطر گل رز',
        slug: 'rose-perfume',
        description: 'عطر زنانه با رایحه ملایم گل رز و نتهای وانیلی. مناسب فصل بهار و تابستان.',
        posterUrl: 'https://placehold.co/400x565/FCE7F3/DB2777?text=Perfume',
        price: '۴۵۰,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'اورجینال',
        rating: 9.0,
        featured: true,
        categorySlugs: ['perfume'],
      },
      {
        title: 'دستبند کریستالی',
        slug: 'crystal-bracelet',
        description: 'دستبند کریستالی زیبا با طراحی فانتزی. مناسب برای کادو و هدیه.',
        posterUrl: 'https://placehold.co/400x565/FDF2F8/BE185D?text=Bracelet',
        price: '۱۲۰,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'فانتزی',
        rating: 7.8,
        featured: true,
        categorySlugs: ['accessory'],
      },
      {
        title: 'دفتر فانتزی ابریشمی',
        slug: 'silk-fantasy-notebook',
        description: 'دفتر یادداشت با جلد ابریشمی و طراحی فانتزی. مناسب برای خاطره‌نویسی و نقاشی.',
        posterUrl: 'https://placehold.co/400x565/FCE7F3/EC4899?text=Notebook',
        price: '۹۵,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'فانتزی',
        rating: 8.2,
        featured: false,
        categorySlugs: ['stationery'],
      },
      {
        title: 'پالت سایه چشم',
        slug: 'eyeshadow-palette',
        description: 'پالت ۱۲ رنگی سایه چشم با تنالیته‌های صورتی و بنفش فانتزی.',
        posterUrl: 'https://placehold.co/400x565/FFE4E6/A855F7?text=Palette',
        price: '۳۲۰,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'اورجینال',
        rating: 8.8,
        featured: true,
        categorySlugs: ['cosmetics'],
      },
      {
        title: 'گوشواره مرواریدی',
        slug: 'pearl-earrings',
        description: 'گوشواره مرواریدی فانتزی با طراحی لطیف و زنانه.',
        posterUrl: 'https://placehold.co/400x565/FDF2F8/DB2777?text=Earrings',
        price: '۸۵,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'فانتزی',
        rating: 7.5,
        featured: false,
        categorySlugs: ['accessory'],
      },
      {
        title: 'ادکلن جیگر',
        slug: 'jiger-perfume',
        description: 'ادکلن زنانه با رایحه گلی و میوه‌ای تازه. ماندگاری بالا.',
        posterUrl: 'https://placehold.co/400x565/FCE7F3/BE185D?text=Jiger',
        price: '۲۸۰,۰۰۰ تومان',
        year: 2023,
        status: 'available',
        subType: 'اورجینال',
        rating: 8.3,
        featured: false,
        categorySlugs: ['perfume'],
      },
      {
        title: 'ست قلم فانتزی',
        slug: 'fantasy-pen-set',
        description: 'ست ۵تایی قلم روان‌نویس با طرح‌های فانتزی و جعبه مخملی.',
        posterUrl: 'https://placehold.co/400x565/FFE4E6/EC4899?text=Pen+Set',
        price: '۱۵۰,۰۰۰ تومان',
        year: 2024,
        status: 'available',
        subType: 'فانتزی',
        rating: 7.9,
        featured: false,
        categorySlugs: ['stationery'],
      },
    ];

    for (const p of sampleProducts) {
      const cids = p.categorySlugs.map(s => catMap.get(s)).filter(Boolean) as string[];
      await db.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          title: p.title,
          slug: p.slug,
          description: p.description,
          posterUrl: p.posterUrl,
          price: p.price,
          year: p.year,
          status: p.status,
          subType: p.subType,
          rating: p.rating,
          featured: p.featured,
          categories: { create: cids.map(cid => ({ categoryId: cid })) },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Database seeded with fantasy products' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Seeding failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
