import React, { memo } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  title?: string | React.ReactNode;
}

const MovieList = memo<MovieListProps>(({ movies, onMovieClick, title }) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-section-header flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-primary rounded-full"></span>
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </div>
  );
});

MovieList.displayName = 'MovieList';

export default MovieList;