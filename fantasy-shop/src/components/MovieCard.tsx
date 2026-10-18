'use client';

import { motion } from 'framer-motion';
import { Star, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const disableFolder = process.env.NEXT_PUBLIC_DISABLE_FOLDER === 'true';

interface MovieCategory {
  id: string;
  movieId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Movie {
  id: string;
  title: string;
  code?: string | null;
  slug: string;
  description?: string | null;
  posterUrl?: string | null;
  year?: number | null;
  ageRating?: string | null;
  status: string;
  episodeInfo?: string | null;
  subType?: string | null;
  rating?: number | null;
  featured?: boolean | null;
  categories: MovieCategory[];
}

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onOpenFolder: (movieId: string) => void;
  index?: number;
}

const statusLabels: Record<string, string> = {
  airing: 'در حال فروش',
  completed: 'تمام شده',
  upcoming: 'به زودی',
};

export default function MovieCard({ movie, onClick, onOpenFolder, index = 0 }: MovieCardProps) {
  const handleOpenFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFolder(movie.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <div className="relative overflow-hidden rounded-xl border border-fantasy-border bg-fantasy-card transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10">
        {/* Poster */}
        <div className="relative aspect-[2/2.8] overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-fantasy-surface">
              <span className="text-4xl">🛍️</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Top Badges */}
          <div className="absolute top-2 right-2 left-2 flex items-start justify-between">
            {movie.ageRating && (
              <Badge className="bg-black/70 text-white text-[10px] px-1.5 py-0 border-0 backdrop-blur-sm">
                {movie.ageRating}
              </Badge>
            )}
            {movie.subType && (
              <Badge className={cn(
                'text-[10px] px-1.5 py-0 border-0 backdrop-blur-sm',
                movie.subType === 'دوبله'
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-amber-500/80 text-white'
              )}>
                {movie.subType}
              </Badge>
            )}
          </div>

          {/* Episode Info */}
          {movie.episodeInfo && (
            <Badge className="absolute top-9 right-2 bg-black/70 text-fantasy-muted text-[10px] px-1.5 py-0 border-0 backdrop-blur-sm">
              {movie.episodeInfo}
            </Badge>
          )}

          {/* Status Indicator */}
          {movie.status === 'airing' && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <span className="text-[10px] text-rose-400 font-medium">در حال فروش</span>
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 p-3">
            <h3 className="text-sm font-bold text-white leading-relaxed line-clamp-2 mb-1">
              {movie.title}
            </h3>
            {movie.code && (
              <span className="inline-block text-[10px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded mb-2">
                {movie.code}
              </span>
            )}
            {!disableFolder && (
              <Button
                size="sm"
                className="w-full bg-primary/90 hover:bg-primary text-white text-xs h-8"
                onClick={handleOpenFolder}
              >
                <FolderOpen className="h-3.5 w-3.5 ml-1" />
                مشاهده محصول
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="p-3 space-y-2">
          <h3 className="text-sm font-bold text-white leading-relaxed line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-fantasy-muted">{movie.rating?.toFixed(1) || '—'}</span>
            </div>
            {movie.year && (
              <span className="text-xs text-fantasy-muted">{movie.year}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export type { Movie, MovieCategory };