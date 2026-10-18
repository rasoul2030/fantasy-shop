'use client';

import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
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
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95',
            activeCategory === 'all'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-300/25'
              : 'bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 border border-fantasy-border'
          )}
        >
          همه
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95',
              activeCategory === cat.slug
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-300/25'
                : 'bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 border border-fantasy-border'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
