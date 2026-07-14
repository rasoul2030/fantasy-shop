'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import FeaturedRow from '@/components/FeaturedRow';
import MovieGrid from '@/components/MovieGrid';
import MovieDetail from '@/components/MovieDetail';
import AdminPanel from '@/components/AdminPanel';
import { type Movie } from '@/components/MovieCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: { movies: number };
}

export default function HomePage() {
  const { toast } = useToast();

  // View state
  const [isAdmin, setIsAdmin] = useState(false);

  // Data state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Detail modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // silent
    }
  }, []);

  // Fetch movies with filters
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', limit.toString());
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/movies?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies);
        setTotal(data.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, statusFilter, currentPage]);

  // Fetch featured movies
  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch('/api/movies?status=airing&limit=20&page=1');
      if (res.ok) {
        const data = await res.json();
        setFeaturedMovies(data.movies.filter((m: Movie) => m.featured));
      }
    } catch {
      // silent
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, statusFilter]);

  // Refresh all data
  const refreshData = useCallback(() => {
    fetchCategories();
    fetchMovies();
    fetchFeatured();
  }, [fetchCategories, fetchMovies, fetchFeatured]);

  // Handle movie card click -> open detail
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetail(true);
  };

  // Handle open folder
  const handleOpenFolder = async (movieId: string) => {
    try {
      const res = await fetch('/api/movies/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      });
      if (res.ok) {
        const data = await res.json();
        toast({ title: 'پوشه باز شد', description: data.message });
      } else {
        const data = await res.json().catch(() => ({}));
        toast({
          title: 'خطا',
          description: data.error || 'امکان باز کردن پوشه وجود ندارد',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col bg-cinematic-bg">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAdminClick={() => setIsAdmin(!isAdmin)}
        isAdmin={isAdmin}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="pt-6"
            >
              <AdminPanel
                categories={categories}
                movies={movies}
                loading={loading}
                onBack={() => setIsAdmin(false)}
                onDataChange={refreshData}
                onOpenFolder={handleOpenFolder}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Featured Row */}
              {!searchQuery && activeCategory === 'all' && statusFilter === 'all' && featuredMovies.length > 0 && (
                <FeaturedRow
                  movies={featuredMovies}
                  onMovieClick={handleMovieClick}
                  onOpenFolder={handleOpenFolder}
                />
              )}

              {/* Section Title */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
                <h2 className="text-base font-bold text-white">
                  {activeCategory !== 'all'
                    ? categories.find((c) => c.slug === activeCategory)?.name || 'فیلم‌ها'
                    : searchQuery
                    ? `نتایج جستجو: "${searchQuery}"`
                    : statusFilter !== 'all'
                    ? statusFilter === 'airing'
                      ? 'در حال پخش'
                      : statusFilter === 'completed'
                      ? 'تکمیل شده'
                      : 'آینده'
                    : 'همه فیلم‌ها'}
                </h2>
                <p className="text-xs text-cinematic-muted mt-1">
                  {total} فیلم یافت شد
                </p>
              </div>

              {/* Movie Grid */}
              <MovieGrid
                movies={movies}
                loading={loading}
                onMovieClick={handleMovieClick}
                onOpenFolder={handleOpenFolder}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!isAdmin && (
        <footer className="mt-auto border-t border-cinematic-border bg-cinematic-bg/50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-cinematic-muted">
              مدیریت فیلم — تمامی حقوق محفوظ است
            </p>
          </div>
        </footer>
      )}

      {/* Movie Detail Modal */}
      <MovieDetail
        movie={selectedMovie}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
          setTimeout(() => setSelectedMovie(null), 200);
        }}
        onOpenFolder={handleOpenFolder}
      />
    </div>
  );
}