// Tipos básicos para la respuesta de la API de Jikan (v4)
export interface JikanAnime {
  mal_id: number;
  title: string;
  synopsis: string | null;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id: string | null;
    images?: {
      image_url: string | null;
      small_image_url: string | null;
      medium_image_url: string | null;
      large_image_url: string | null;
      maximum_image_url: string | null;
    };
  };
  score: number | null;
  episodes: number | null;
  year: number | null;
}

export interface JikanAnimeResponse {
  data: JikanAnime;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: JikanPagination;
}

// Tipo que representa nuestro Anime en Supabase
export interface DatabaseAnime {
  id: string; // UUID
  external_id: number; // Jikan ID
  title: string;
  synopsis: string | null;
  cover_image: string | null;
  average_score: number;
  total_reviews: number;
  created_at: string;
}
