'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import { type Product } from '@/components/ProductCard';
import dynamic from 'next/dynamic';

const FeaturedRow = dynamic(() => import('@/components/FeaturedRow'), { ssr: false });
const ProductDetail = dynamic(() => import('@/components/ProductDetail'), { ssr: false });
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: { products: number };
}

export default function HomePage() {
  const { toast } = useToast();

  // View state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLogging, setAdminLogging] = useState(false);
  const isProduction = process.env.NODE_ENV === 'production';

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', limit.toString());
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, statusFilter, currentPage]);

  // Fetch featured products - server-side filter for featured only
  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch('/api/products?status=available&featured=true&limit=10&page=1');
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data.products);
      }
    } catch {
      // silent
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchFeatured();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, statusFilter]);

  // Fetch products when filters/page change (skip initial load)
  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  // Refresh all data
  const refreshData = useCallback(() => {
    fetchCategories();
    fetchProducts();
    fetchFeatured();
  }, [fetchCategories, fetchProducts, fetchFeatured]);

  // Handle product card click - memoized with useCallback
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  }, []);

  // Admin login handler
  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) return;
    setAdminLogging(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
        toast({ title: 'خوش آمدید', description: 'وارد بخش مدیریت شدید' });
      } else {
        toast({ title: 'خطا', description: 'رمز عبور اشتباه است', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    } finally {
      setAdminLogging(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col bg-fantasy-bg">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAdminClick={() => {
          if (isAdmin) {
            setIsAdmin(false);
          } else if (isProduction) {
            setShowAdminLogin(true);
          } else {
            setIsAdmin(true);
          }
        }}
        isAdmin={isAdmin}
      />

      <main className="flex-1">
        <div className={isAdmin ? 'page-view-enter' : 'page-view-enter'}>
          {isAdmin ? (
            <div className="pt-6">
              <AdminPanel
                categories={categories}
                products={products}
                loading={loading}
                onBack={() => setIsAdmin(false)}
                onDataChange={refreshData}
              />
            </div>
          ) : (
            <div>
              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Featured Row */}
              {!searchQuery && activeCategory === 'all' && statusFilter === 'all' && featuredProducts.length > 0 && (
                <FeaturedRow
                  products={featuredProducts}
                  onProductClick={handleProductClick}
                />
              )}

              {/* Section Title */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
                <h2 className="text-base font-bold text-gray-800">
                  {activeCategory !== 'all'
                    ? categories.find((c) => c.slug === activeCategory)?.name || 'محصولات'
                    : searchQuery
                    ? `نتایج جستجو: "${searchQuery}"`
                    : statusFilter !== 'all'
                    ? statusFilter === 'available'
                      ? 'محصولات موجود'
                      : statusFilter === 'unavailable'
                      ? 'ناموجود'
                      : 'به‌زودی'
                    : 'همه محصولات'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {total} محصول یافت شد
                </p>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={products}
                loading={loading}
                onProductClick={handleProductClick}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      {!isAdmin && (
        <footer className="mt-auto border-t border-fantasy-border bg-white/50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-gray-400">
              محصولات فانتزی — تمامی حقوق محفوظ است
            </p>
          </div>
        </footer>
      )}

      {/* Admin Password Dialog */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-xl border border-fantasy-border bg-white p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">ورود به مدیریت</h3>
            <p className="text-sm text-gray-500">رمز عبور مدیریت را وارد کنید</p>
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="رمز عبور"
              className="border-fantasy-border bg-pink-50/50 text-gray-800 placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-fantasy-border text-gray-600"
                onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }}
              >
                انصراف
              </Button>
              <Button
                onClick={handleAdminLogin}
                disabled={adminLogging || !adminPassword.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {adminLogging ? '...' : 'ورود'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
          setTimeout(() => setSelectedProduct(null), 200);
        }}
      />
    </div>
  );
}
