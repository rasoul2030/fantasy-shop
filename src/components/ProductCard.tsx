'use client';

import { motion } from 'framer-motion';
import { Star, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCategory {
  id: string;
  productId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Product {
  id: string;
  title: string;
  code?: string | null;
  slug: string;
  description?: string | null;
  posterUrl?: string | null;
  price?: string | null;
  year?: number | null;
  ageRating?: string | null;
  status: string;
  episodeInfo?: string | null;
  subType?: string | null;
  rating?: number | null;
  featured?: boolean | null;
  categories: ProductCategory[];
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index?: number;
}

const statusLabels: Record<string, string> = {
  available: 'موجود',
  unavailable: 'ناموجود',
  upcoming: 'به‌زودی',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export default function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      className="group relative cursor-pointer"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden rounded-xl border border-fantasy-border bg-white shadow-sm transition-all duration-300 group-hover:border-pink-300 group-hover:shadow-lg group-hover:shadow-pink-200/50">
        {/* Poster */}
        <div className="relative aspect-[2/2.8] overflow-hidden">
          {product.posterUrl ? (
            <img
              src={product.posterUrl}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
              <span className="text-4xl">✨</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-pink-600/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Top Badges */}
          <div className="absolute top-2 right-2 left-2 flex items-start justify-between">
            {product.price && (
              <Badge className="bg-pink-500 text-white text-[10px] px-2 py-0.5 border-0 backdrop-blur-sm font-bold shadow-sm">
                {product.price}
              </Badge>
            )}
            {product.subType && (
              <Badge className="bg-white/80 text-pink-600 text-[10px] px-1.5 py-0 border-0 backdrop-blur-sm">
                {product.subType}
              </Badge>
            )}
          </div>

          {/* Status Indicator */}
          {product.status === 'available' && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] text-emerald-300 font-medium">موجود</span>
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 p-3">
            <h3 className="text-sm font-bold text-white leading-relaxed line-clamp-2 mb-1">
              {product.title}
            </h3>
            {product.code && (
              <span className="inline-block text-[10px] font-mono bg-pink-500/30 text-pink-100 px-1.5 py-0.5 rounded mb-2">
                {product.code}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="p-3 space-y-2">
          <h3 className="text-sm font-bold text-gray-800 leading-relaxed line-clamp-1 group-hover:text-pink-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-500">{product.rating?.toFixed(1) || '—'}</span>
            </div>
            {product.price && (
              <span className="text-xs font-bold text-pink-500">{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export type { Product, ProductCategory };
