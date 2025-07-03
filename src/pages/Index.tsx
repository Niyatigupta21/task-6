import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Movie, MovieDetails as MovieDetailsType, Cast } from '@/types/movie';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getTrendingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
  getTrendingAll,
  searchMulti, 
  getMovieDetails, 
  getTVDetails,
  getMovieCredits,
  getTVCredits
} from '@/lib/tmdb';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Film, TrendingUp, TrendingDown } from 'lucide-react';

// Lazy load components for better performance
const MovieList = lazy(() => import('@/components/MovieList'));
const MovieDetails = lazy(() => import('@/components/MovieDetails'));

type ViewMode = 'home' | 'search' | 'details';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  
  // Movie and TV show states
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<Movie[]>([]);
  const [trendingAll, setTrendingAll] = useState<Movie[]>([]);
  
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsType | null>(null);
  const [movieCast, setMovieCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [
          popularMoviesResponse,
          topRatedMoviesResponse,
          trendingMoviesResponse,
          popularTVResponse,
          topRatedTVResponse,
          trendingTVResponse,
          trendingAllResponse
        ] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getTrendingMovies('week'),
          getPopularTVShows(),
          getTopRatedTVShows(),
          getTrendingTVShows('week'),
          getTrendingAll('week')
        ]);
        
        setPopularMovies(popularMoviesResponse.results);
        setTopRatedMovies(topRatedMoviesResponse.results);
        setTrendingMovies(trendingMoviesResponse.results);
        setPopularTVShows(popularTVResponse.results);
        setTopRatedTVShows(topRatedTVResponse.results);
        setTrendingTVShows(trendingTVResponse.results);
        setTrendingAll(trendingAllResponse.results);
      } catch (error) {
        console.error('Error loading content:', error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setSearchQuery(query);
      const response = await searchMulti(query);
      setSearchResults(response.results);
      setViewMode('search');
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Search Error",
        description: "Failed to search content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
    setViewMode('home');
  }, []);

  // Handle movie/TV selection
  const handleMovieClick = useCallback(async (movie: Movie) => {
    try {
      setLoading(true);
      const isTV = movie.media_type === 'tv' || movie.name;
      
      const [details, credits] = await Promise.all([
        isTV ? getTVDetails(movie.id) : getMovieDetails(movie.id),
        isTV ? getTVCredits(movie.id) : getMovieCredits(movie.id)
      ]);
      
      setSelectedMovie(details);
      setMovieCast(credits.cast);
      setViewMode('details');
    } catch (error) {
      console.error('Error loading details:', error);
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Go back to home
  const handleBack = useCallback(() => {
    setSelectedMovie(null);
    setMovieCast([]);
    setViewMode(searchQuery ? 'search' : 'home');
  }, [searchQuery]);

  if (loading && viewMode === 'home' && popularMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CineDiscover
              </h1>
            </div>
          </div>
          
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search movies, TV shows, and more..."
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          {viewMode === 'details' && selectedMovie && (
            <MovieDetails
              movie={selectedMovie}
              cast={movieCast}
              onBack={handleBack}
            />
          )}

          {viewMode === 'search' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-section-header mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-muted-foreground">
                  Found {searchResults.length} results
                </p>
              </div>
              
              {loading ? (
                <LoadingSpinner />
              ) : (
                <MovieList
                  movies={searchResults}
                  onMovieClick={handleMovieClick}
                />
              )}
            </div>
          )}

          {viewMode === 'home' && (
            <div className="space-y-12">
              {/* Welcome Section */}
              <div className="text-center py-8">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Discover Amazing Content
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore the latest blockbusters, trending TV series, timeless classics, and hidden gems from around the world
                </p>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Trending This Week */}
                  <MovieList
                    title={
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Trending This Week
                      </div>
                    }
                    movies={trendingAll}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Popular Movies */}
                  <MovieList
                    title="🎬 Popular Movies"
                    movies={popularMovies}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Trending Movies */}
                  <MovieList
                    title={
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        Trending Movies
                      </div>
                    }
                    movies={trendingMovies}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Popular TV Shows */}
                  <MovieList
                    title="📺 Popular TV Shows"
                    movies={popularTVShows}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Trending TV Shows */}
                  <MovieList
                    title={
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        Trending TV Shows
                      </div>
                    }
                    movies={trendingTVShows}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Top Rated Movies */}
                  <MovieList
                    title="⭐ Top Rated Movies"
                    movies={topRatedMovies}
                    onMovieClick={handleMovieClick}
                  />

                  {/* Top Rated TV Shows */}
                  <MovieList
                    title="🏆 Top Rated TV Shows"
                    movies={topRatedTVShows}
                    onMovieClick={handleMovieClick}
                  />
                </>
              )}
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
