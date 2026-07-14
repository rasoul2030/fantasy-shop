import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const categories = [
      { name: 'اکشن', slug: 'action', type: 'movie' },
      { name: 'انیمیشن', slug: 'animation', type: 'movie' },
      { name: 'کمدی', slug: 'comedy', type: 'movie' },
      { name: 'درام', slug: 'drama', type: 'movie' },
      { name: 'ترسناک', slug: 'horror', type: 'movie' },
      { name: 'علمی-تخیلی', slug: 'sci-fi', type: 'movie' },
      { name: 'فانتزی', slug: 'fantasy', type: 'movie' },
      { name: 'ماجراجویی', slug: 'adventure', type: 'movie' },
      { name: 'عاشقانه', slug: 'romance', type: 'movie' },
      { name: 'جنایی', slug: 'crime', type: 'movie' },
      { name: 'مستند', slug: 'documentary', type: 'movie' },
      { name: 'جنگی', slug: 'war', type: 'movie' },
      { name: 'ورزشی', slug: 'sports', type: 'movie' },
      { name: 'خانوادگی', slug: 'family', type: 'movie' },
      { name: 'هیجانی', slug: 'thriller', type: 'movie' },
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

    const sampleMovies = [
      {
        title: 'موشوکو تنسی فصل ۳',
        slug: 'mushoku-tensei-iii',
        description: 'داستان ادامه ماجراجویی‌های رودئوس در دنیای دیگر. فصل سوم این انیمه محبوب.',
        posterUrl: 'https://placehold.co/400x565/1a1a2e/e94560?text=Mushoku+S3',
        year: 2025,
        ageRating: '13+',
        status: 'airing',
        episodeInfo: 'S3 EP2',
        subType: 'سافت ساب',
        rating: 8.7,
        featured: true,
        categorySlugs: ['fantasy', 'adventure', 'drama'],
      },
      {
        title: 'Grand Blue فصل ۳',
        slug: 'grand-blue-s3',
        description: 'انیمه کمدی و ماجراجویی غواصی.',
        posterUrl: 'https://placehold.co/400x565/16213e/0f3460?text=Grand+Blue+S3',
        year: 2026,
        ageRating: '13+',
        status: 'airing',
        episodeInfo: 'S3 EP2',
        subType: 'سافت ساب',
        rating: 8.2,
        featured: true,
        categorySlugs: ['comedy', 'sports', 'adventure'],
      },
      {
        title: 'وان پیس',
        slug: 'one-piece',
        description: 'مونکی دی. لوفی و طاقم کلاه‌خوش در جستجوی گنج ملی.',
        posterUrl: 'https://placehold.co/400x565/1a1a2e/e94560?text=One+Piece',
        year: 1999,
        ageRating: '13+',
        status: 'airing',
        episodeInfo: 'S1 EP1100+',
        subType: 'سافت ساب',
        rating: 9.1,
        featured: true,
        categorySlugs: ['action', 'adventure', 'comedy'],
      },
      {
        title: 'جوجوتسو کایسن',
        slug: 'jujutsu-kaisen',
        description: 'یوجی ایتادوری وارد دنیای جادو می‌شود.',
        posterUrl: 'https://placehold.co/400x565/0f3460/e94560?text=JJK',
        year: 2020,
        ageRating: '16+',
        status: 'completed',
        episodeInfo: 'S2 EP23',
        subType: 'سافت ساب',
        rating: 8.8,
        featured: false,
        categorySlugs: ['action', 'horror', 'fantasy'],
      },
      {
        title: 'اسپایر ایکس فمیلیا',
        slug: 'spy-x-family',
        description: 'جاسوس، قاتل و دختری با قدرت‌های ذهنی یک خانواده جعلی تشکیل می‌دهند.',
        posterUrl: 'https://placehold.co/400x565/e94560/1a1a2e?text=Spy+Family',
        year: 2022,
        ageRating: '13+',
        status: 'completed',
        episodeInfo: 'S2 EP12',
        subType: 'دوبله',
        rating: 8.6,
        featured: true,
        categorySlugs: ['action', 'comedy', 'family'],
      },
      {
        title: 'دمون اسلیر',
        slug: 'demon-slayer',
        description: 'تانجیرو کوجو برای نجات خواهرش به شکار اهریمنان می‌پردازد.',
        posterUrl: 'https://placehold.co/400x565/533483/e94560?text=Demon+Slayer',
        year: 2019,
        ageRating: '16+',
        status: 'completed',
        episodeInfo: 'S4 EP8',
        subType: 'سافت ساب',
        rating: 8.5,
        featured: false,
        categorySlugs: ['action', 'fantasy', 'drama'],
      },
      {
        title: 'اتک آن تایتان',
        slug: 'attack-on-titan',
        description: 'ارن یاگر و ارتش انسان‌ها در جنگ علیه تایتان‌ها.',
        posterUrl: 'https://placehold.co/400x565/2d4059/ea5455?text=AoT',
        year: 2013,
        ageRating: '16+',
        status: 'completed',
        episodeInfo: 'S4 EP87',
        subType: 'سافت ساب',
        rating: 9.0,
        featured: true,
        categorySlugs: ['action', 'drama', 'thriller'],
      },
      {
        title: 'شینچان',
        slug: 'crayon-shin-chan',
        description: 'ماجراهای بامزه شین‌نوبو نوهارا.',
        posterUrl: 'https://placehold.co/400x565/f7ec09/333333?text=Shin+Chan',
        year: 1992,
        ageRating: '7+',
        status: 'airing',
        episodeInfo: 'S1 EP1200+',
        subType: 'دوبله',
        rating: 7.8,
        featured: false,
        categorySlugs: ['comedy', 'family', 'animation'],
      },
    ];

    for (const m of sampleMovies) {
      const cids = m.categorySlugs.map(s => catMap.get(s)).filter(Boolean) as string[];
      await db.movie.upsert({
        where: { slug: m.slug },
        update: {},
        create: {
          title: m.title,
          slug: m.slug,
          description: m.description,
          posterUrl: m.posterUrl,
          year: m.year,
          ageRating: m.ageRating,
          status: m.status,
          episodeInfo: m.episodeInfo,
          subType: m.subType,
          rating: m.rating,
          featured: m.featured,
          categories: { create: cids.map(cid => ({ categoryId: cid })) },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Database seeded' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Seeding failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}