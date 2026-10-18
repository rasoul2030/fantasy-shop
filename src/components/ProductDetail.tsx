'use client';

import { motion } from 'framer-motion';
import { Star, X, Calendar, Sparkles, ShoppingCart, Hash, Tag } from 'lucide-react';
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

const statusLabels: Record<string, { label: string; color: string; dotColor: string }> = {
  available: {
    label: 'موجود',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  unavailable: {
    label: 'ناموجود',
    color: 'bg-red-100 text-red-500 border-red-200',
    dotColor: 'bg-red-500',
  },
  upcoming: {
    label: 'به‌زودی',
    color: 'bg-amber-100 text-amber-500 border-amber-200',
    dotColor: 'bg-amber-500',
  },
};

export default function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  if (!product) return null;

  const statusInfo = statusLabels[product.status] || statusLabels.available;
  const isAvailable = product.status === 'available';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] border-fantasy-border bg-white p-0 overflow-hidden shadow-2xl shadow-pink-200/40">
        <div className="relative">
          {/* Banner/Poster Area */}
          <motion.div
            className="relative h-72 sm:h-80 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {product.posterUrl ? (
              <img
                src={product.posterUrl}
                alt={product.title}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-purple-50">
                <span className="text-7xl">✨</span>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
            {/* Dark overlay at top for close button */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />

            {/* Close Button */}
            <motion.button
              className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-800 flex items-center justify-center shadow-lg transition-colors z-20"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* Status Badge on poster */}
            <motion.div
              className="absolute top-3 right-3 z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Badge className={cn('text-xs px-3 py-1 border shadow-sm', statusInfo.color)}>
                <span className={cn('inline-block w-1.5 h-1.5 rounded-full ml-1.5', statusInfo.dotColor)} />
                {statusInfo.label}
              </Badge>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="px-6 sm:px-8 pb-6 -mt-20 relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          >
            <DialogHeader className="mb-3">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* Product Code */}
            {product.code && (
              <motion.div
                className="flex items-center gap-1.5 mb-3 text-xs text-gray-400 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Hash className="h-3 w-3" />
                <span>کد محصول: {product.code}</span>
              </motion.div>
            )}

            {/* Meta Info Row */}
            <motion.div
              className="flex flex-wrap items-center gap-2.5 mb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {product.year && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  {product.year}
                </div>
              )}
              {product.rating && (
                <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {product.rating.toFixed(1)}
                </div>
              )}
              {product.price && (
                <div className="flex items-center gap-1.5 text-sm text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {product.price}
                </div>
              )}
              {product.subType && (
                <Badge className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                  <Tag className="h-3 w-3 ml-1" />
                  {product.subType}
                </Badge>
              )}
            </motion.div>

            {/* Categories */}
            {product.categories.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1.5 mb-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {product.categories.map((pc) => (
                  <Badge
                    key={pc.id}
                    variant="outline"
                    className="border-pink-200 bg-pink-50/80 text-pink-600 text-xs px-3 py-0.5"
                  >
                    {pc.category.name}
                  </Badge>
                ))}
              </motion.div>
            )}

            {/* Description */}
            {product.description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <div className="bg-gradient-to-br from-pink-50/50 via-white to-purple-50/30 rounded-xl p-4 mb-5 border border-fantasy-border">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">توضیحات محصول</h4>
                  <p className="text-sm leading-8 text-gray-600 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="flex gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Button
                className={cn(
                  'flex-1 h-11 text-sm font-bold rounded-xl transition-all duration-300',
                  isAvailable
                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-300/40 hover:shadow-pink-400/50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                )}
                disabled={!isAvailable}
              >
                <ShoppingCart className="h-4 w-4 ml-2" />
                {isAvailable ? 'افزودن به سبد خرید' : 'ناموجود'}
              </Button>
              <Button
                variant="outline"
                className="h-11 px-5 rounded-xl border-fantasy-border text-pink-500 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={onClose}
              >
                بستن
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
