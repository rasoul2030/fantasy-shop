'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard, { type Movie } from './MovieCard';

interface FeaturedRowProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onOpenFolder: (movieId: string) => void;
}

export default function FeaturedRow({ movies, onMovieClick, onOpenFolder }: FeaturedRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (movies.length === 0) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <h2 className="text-lg font-bold text-white">در حال فروش</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-fantasy-muted hover:text-white hover:bg-fantasy-card"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-fantasy-muted hover:text-white hover:bg-fantasy-card"
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
        {movies.map((movie, idx) => (
          <div key={movie.id} className="shrink-0 w-[170px] sm:w-[185px]">
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              onOpenFolder={onOpenFolder}
              index={idx}
            />
          </div>
        ))}
      </div>
    </section>
  );
}