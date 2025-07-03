import React, { memo } from 'react';
import { Movie } from '@/types/movie';
import { imageUrl } from '@/lib/tmdb';
import { Star, Film, Tv } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo<MovieCardProps>(({ movie, onClick }) => {
  const handleClick = () => {
    onClick(movie);
  };

  const title = movie.title || movie.name || 'Unknown Title';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const isTV = movie.media_type === 'tv' || movie.name;

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gradient-card shadow-poster">
        <img
          src={imageUrl(movie.poster_path)}
          alt={title}
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Media type indicator */}
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-full p-1">
          {isTV ? (
            <Tv className="w-3 h-3 text-primary" />
          ) : (
            <Film className="w-3 h-3 text-primary" />
          )}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <h3 className="text-foreground font-semibold text-sm mb-2 line-clamp-2">
              {title}
            </h3>
            {year && (
              <p className="text-muted-foreground text-xs mb-2">{year}</p>
            )}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-primary font-medium text-sm">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="text-xs text-foreground font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;