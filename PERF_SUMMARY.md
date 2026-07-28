# خلاصه بهینه‌سازی عملکرد

## تغییرات انجام شده:

### ۱. حذف framer-motion (بزرگترین بهبود حجم)
- از تمام ۶ کامپوننت حذف شد
- جایگزینی با انیمیشن‌های CSS خالص (keyframes)
- صرفه‌جویی ~۳۰+ KB حجم فشرده JS

### ۲. Dynamic Import (کد اسپلیتینگ)
- AdminPanel (۸۱۳ خط) - لود تنبل
- MovieDetail (مودال) - لود تنبل
- FeaturedRow (کاروسل) - لود تنبل

### ۳. کش هدر API
- categories: s-maxage=60
- movies: s-maxage=30
- stale-while-revalidate برای تجربه کاربری بهتر

### ۴. صفحه Loading
- loading.tsx با اسکلتون UI
- نمایش فوری هنگام لود اولیه

### ۵. بهینه‌سازی فونت
- Preload فونت Vazirmatn
- unicode-range برای لود سریع‌تر

### ۶. بهینه‌سازی تصاویر
- loading="lazy" روی همه پوسترها
- decoding="async" برای رندر غیربلوکه

### ۷. بهینه‌سازی CSS
- حذف متغیرهای تکراری (:root و .dark)
- انیمیشن‌های CSS با prefers-reduced-motion

### ۸. بهینه‌سازی next.config.ts
- حذف output: "standalone" (برای Vercel لازم نیست)
- poweredByHeader: false
- تنظیمات بهینه تصاویر

### ۹. بهینه‌سازی Layout
- Viewport export برای theme-color
- فاوآیکن
- فریم‌ورک متادیتا

### ۱۰. بهینه‌سازی useEffect
- حذف fetch تکراری در صفحه اول
- استفاده از ref برای جلوگیری از دو بار لود
