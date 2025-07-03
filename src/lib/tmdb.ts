import { Movie, MovieDetails, TMDBResponse, MovieCredits } from '@/types/movie';

// TMDB API Configuration
const TMDB_API_KEY = 'a07e22bc18f5cb106bfe4cc1f83ad8ed';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const imageUrl = (path: string | null, size: 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// API helper function
const fetchFromTMDB = async <T>(endpoint: string, additionalParams: string = ''): Promise<T> => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}${additionalParams}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  
  return response.json();
};

// API functions
export const getPopularMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/movie/popular?page=${page}`);
};

export const getTopRatedMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/movie/top_rated?page=${page}`);
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`);
};

export const getPopularTVShows = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/tv/popular?page=${page}`);
};

export const getTopRatedTVShows = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/tv/top_rated?page=${page}`);
};

export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/trending/tv/${timeWindow}`);
};

export const getTrendingAll = async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/trending/all/${timeWindow}`);
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

export const searchMulti = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
  return fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return fetchFromTMDB(`/movie/${movieId}`);
};

export const getTVDetails = async (tvId: number): Promise<MovieDetails> => {
  return fetchFromTMDB(`/tv/${tvId}`);
};

export const getMovieCredits = async (movieId: number): Promise<MovieCredits> => {
  return fetchFromTMDB(`/movie/${movieId}/credits`);
};

export const getTVCredits = async (tvId: number): Promise<MovieCredits> => {
  return fetchFromTMDB(`/tv/${tvId}/credits`);
};