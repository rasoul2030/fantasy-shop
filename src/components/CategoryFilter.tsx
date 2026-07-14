'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { movies: number };
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4">
      <div className="flex items-center gap-2 px-4 sm:px-6 max-w-7xl mx-auto min-w-max">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange('all')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-cinematic-surface text-cinematic-muted hover:bg-cinematic-card hover:text-white border border-cinematic-border'
          )}
        >
          همه
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
              activeCategory === cat.slug
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-cinematic-surface text-cinematic-muted hover:bg-cinematic-card hover:text-white border border-cinematic-border'
            )}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}