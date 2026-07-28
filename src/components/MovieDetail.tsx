'use client';

import { Star, FolderOpen, X, Calendar, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Movie } from './MovieCard';
import { cn } from '@/lib/utils';

interface MovieDetailProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onOpenFolder: (movieId: string) => void;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  airing: { label: 'در حال پخش', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  completed: { label: 'تکمیل شده', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  upcoming: { label: 'آینده', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export default function MovieDetail({ movie, open, onClose, onOpenFolder }: MovieDetailProps) {
  if (!movie) return null;

  const statusInfo = statusLabels[movie.status] || statusLabels.completed;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] border-cinematic-border bg-cinematic-surface p-0 overflow-hidden">
        <div className="relative detail-fade-in">
          {/* Banner/Poster Area */}
          <div className="relative h-64 sm:h-72 overflow-hidden">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cinematic-card">
                <span className="text-6xl">🎬</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-cinematic-surface via-cinematic-surface/60 to-transparent" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 -mt-16 relative z-10">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-white leading-relaxed">
                {movie.title}
              </DialogTitle>
            </DialogHeader>

            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {movie.year && (
                <div className="flex items-center gap-1 text-sm text-cinematic-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {movie.year}
                </div>
              )}
              {movie.rating && (
                <div className="flex items-center gap-1 text-sm text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {movie.rating.toFixed(1)}
                </div>
              )}
              {movie.ageRating && (
                <Badge className="bg-white/10 text-white text-xs border-0">
                  {movie.ageRating}
                </Badge>
              )}
              <Badge className={cn('text-xs', statusInfo.color)}>
                {statusInfo.label}
              </Badge>
              {movie.subType && (
                <Badge className={cn(
                  'text-xs',
                  movie.subType === 'دوبله'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                )}>
                  {movie.subType}
                </Badge>
              )}
            </div>

            {/* Categories */}
            {movie.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.categories.map((mc) => (
                  <Badge
                    key={mc.id}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary text-xs"
                  >
                    {mc.category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Episode Info */}
            {movie.episodeInfo && (
              <div className="flex items-center gap-2 mb-4 text-sm text-cinematic-muted">
                <Play className="h-3.5 w-3.5" />
                <span>{movie.episodeInfo}</span>
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <p className="text-sm leading-relaxed text-cinematic-muted mb-6">
                {movie.description}
              </p>
            )}

            {/* Actions */}
            {process.env.NEXT_PUBLIC_DISABLE_FOLDER !== 'true' && (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white h-11"
                onClick={() => onOpenFolder(movie.id)}
              >
                <FolderOpen className="h-4 w-4 ml-2" />
                باز کردن پوشه
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}