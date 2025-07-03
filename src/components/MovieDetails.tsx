import React, { memo } from 'react';
import { MovieDetails as MovieDetailsType, Cast } from '@/types/movie';
import { imageUrl } from '@/lib/tmdb';
import { Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieDetailsProps {
  movie: MovieDetailsType;
  cast: Cast[];
  onBack: () => void;
}

const MovieDetails = memo<MovieDetailsProps>(({ movie, cast, onBack }) => {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        <div className="absolute inset-0 w-full h-[70vh]">
          <img
            src={imageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-16">
          <Button
            onClick={onBack}
            variant="secondary"
            className="mb-8 bg-black/50 backdrop-blur-sm border-border hover:bg-black/70"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-32">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={imageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-80 max-w-full rounded-xl shadow-poster mx-auto lg:mx-0"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-muted-foreground italic">"{movie.tagline}"</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="text-primary font-semibold text-lg">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>

                {movie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-section-header mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-primary rounded-full"></span>
            Cast
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.slice(0, 12).map((actor) => (
              <div key={actor.id} className="text-center group">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={imageUrl(actor.profile_path)}
                    alt={actor.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">
                  {actor.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

MovieDetails.displayName = 'MovieDetails';

export default MovieDetails;