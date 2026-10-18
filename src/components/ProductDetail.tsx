'use client';

import { Star, X, Calendar, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Product } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: 'موجود', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  unavailable: { label: 'ناموجود', color: 'bg-red-100 text-red-500 border-red-200' },
  upcoming: { label: 'به‌زودی', color: 'bg-amber-100 text-amber-500 border-amber-200' },
};

export default function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  if (!product) return null;

  const statusInfo = statusLabels[product.status] || statusLabels.available;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] border-fantasy-border bg-white p-0 overflow-hidden">
        <div className="relative detail-fade-in">
          {/* Banner/Poster Area */}
          <div className="relative h-64 sm:h-72 overflow-hidden">
            {product.posterUrl ? (
              <img
                src={product.posterUrl}
                alt={product.title}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-pink-50">
                <span className="text-6xl">✨</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/70 text-gray-600 hover:bg-white/90"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 -mt-16 relative z-10">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {product.year && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {product.year}
                </div>
              )}
              {product.rating && (
                <div className="flex items-center gap-1 text-sm text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {product.rating.toFixed(1)}
                </div>
              )}
              {product.price && (
                <div className="flex items-center gap-1 text-sm text-pink-600 font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {product.price}
                </div>
              )}
              <Badge className={cn('text-xs', statusInfo.color)}>
                {statusInfo.label}
              </Badge>
              {product.subType && (
                <Badge className="bg-pink-100 text-pink-600 border-pink-200 text-xs">
                  {product.subType}
                </Badge>
              )}
            </div>

            {/* Categories */}
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.categories.map((pc) => (
                  <Badge
                    key={pc.id}
                    variant="outline"
                    className="border-pink-200 bg-pink-50 text-pink-600 text-xs"
                  >
                    {pc.category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed text-gray-600 mb-6">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
