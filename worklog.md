---
Task ID: 1-10
Agent: Main Agent
Task: Performance optimization audit and implementation for Lighthouse 95+ target

Work Log:
- Audited all source files: page.tsx, MovieCard.tsx, MovieGrid.tsx, FeaturedRow.tsx, MovieDetail.tsx, Navbar.tsx, CategoryFilter.tsx, AdminPanel.tsx, layout.tsx, globals.css, next.config.ts, package.json, API routes
- Removed framer-motion from ALL 6 components (MovieCard, FeaturedRow, CategoryFilter, MovieDetail, AdminPanel, page.tsx)
- Replaced framer-motion animations with CSS keyframes (card-entrance, fade-in, slide-in-right)
- Added dynamic imports for AdminPanel (813 lines), MovieDetail, FeaturedRow via next/dynamic
- Added cache headers (Cache-Control: s-maxage + stale-while-revalidate) to /api/categories (60s) and /api/movies (30s)
- Created loading.tsx with skeleton UI matching app layout (navbar, categories, grid)
- Added font preload for vazirmatn.woff2 in layout.tsx <head>
- Added unicode-range to @font-face for faster font loading
- Optimized next.config.ts: removed output:"standalone" (Vercel doesn't need it), added poweredByHeader:false, image formats
- Added loading="lazy" and decoding="async" to all poster <img> elements
- Removed duplicate .dark CSS block (identical to :root)
- Added prefers-reduced-motion media query for accessibility
- Added Viewport export in layout.tsx for theme-color meta tag
- Optimized useEffect hooks in page.tsx to prevent double-fetching on mount
- Build successful, all verification checks passed

Stage Summary:
- framer-motion completely eliminated: ~30KB+ gzipped JS savings
- 3 heavy components code-split via dynamic imports
- API routes cached for reduced TTFB
- Font preloading improves FCP/LCP
- Loading skeleton improves perceived performance (Speed Index)
- CSS animations replace JS-driven animations (reduces TBT)
- All 10/10 verification checks passed
- Build clean, no errors