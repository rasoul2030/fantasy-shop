'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard, { type Product } from './ProductCard';

interface FeaturedRowProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FeaturedRow({ products, onProductClick }: FeaturedRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
          </span>
          <h2 className="text-lg font-bold text-gray-800">محصولات ویژه</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-pink-600 hover:bg-pink-50"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-pink-600 hover:bg-pink-50"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto featured-scroll pb-2"
      >
        {products.map((product, idx) => (
          <div key={product.id} className="shrink-0 w-[170px] sm:w-[185px]">
            <ProductCard
              product={product}
              onClick={onProductClick}
              index={idx}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
