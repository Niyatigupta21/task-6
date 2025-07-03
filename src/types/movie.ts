export interface Movie {
  id: number;
  title?: string; // Movies
  name?: string; // TV Shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string; // Movies
  first_air_date?: string; // TV Shows
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult?: boolean;
  original_language: string;
  original_title?: string; // Movies
  original_name?: string; // TV Shows
  popularity: number;
  video?: boolean;
  media_type?: 'movie' | 'tv' | 'person'; // For multi-search results
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime?: number; // Movies
  episode_run_time?: number[]; // TV Shows
  number_of_seasons?: number; // TV Shows
  number_of_episodes?: number; // TV Shows
  status: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  homepage?: string;
  created_by?: { id: number; name: string }[]; // TV Shows
  networks?: { id: number; name: string }[]; // TV Shows
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieCredits {
  cast: Cast[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}