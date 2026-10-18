'use client';

import { Skeleton } from '@/components/ui/skeleton';
import ProductCard, { type Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({
  products,
  loading,
  onProductClick,
  currentPage,
  totalPages,
  onPageChange,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/2.8] w-full rounded-xl bg-pink-100" />
              <Skeleton className="h-4 w-3/4 rounded bg-pink-100" />
              <Skeleton className="h-3 w-1/2 rounded bg-pink-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">🛍️</span>
        <p className="text-lg font-medium text-gray-600">محصولی یافت نشد</p>
        <p className="text-sm mt-1">فیلترهای خود را تغییر دهید</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            index={idx}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 mb-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-fantasy-border bg-white text-gray-500 transition-colors hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            →
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                currentPage === i + 1
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-300/25'
                  : 'border border-fantasy-border bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-fantasy-border bg-white text-gray-500 transition-colors hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ←
          </button>
        </div>
      )}
    </div>
  );
}
