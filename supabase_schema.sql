-- ==========================================
-- FASE 1: ESQUEMA INICIAL DE BASE DE DATOS
-- PROYECTO ANIME PLATFORM
-- ==========================================

-- 1. EXTENSIÓN NECESARIA (Asegura que podamos generar UUIDs)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- LIMPIEZA PREVIA (Opcional pero recomendado en desarrollo)
-- Borraremos las tablas si ya existen para crearlas limpias.
-- Usamos CASCADE para evitar errores de dependencias.
-- ==========================================
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.watchlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.animes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS watchlist_status CASCADE;

-- 2. TABLA DE PERFILES
-- Esta tabla está enlazada 1 a 1 con auth.users de Supabase
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas rápidas de perfil por username
CREATE INDEX idx_profiles_username ON public.profiles(username);


-- 3. TABLA DE ANIMES
-- Usaremos el external_id para guardar el ID de Jikan (MyAnimeList)
CREATE TABLE public.animes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id INTEGER UNIQUE NOT NULL, -- ID de Jikan/MAL
  title TEXT NOT NULL,
  synopsis TEXT,
  cover_image TEXT,
  average_score NUMERIC(3,2) DEFAULT 0 CHECK (average_score >= 0 AND average_score <= 5), -- Puntuación de 1 a 5
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- 4. TABLA DE SEGUIDORES (SISTEMA SOCIAL)
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_following_id ON public.follows(following_id);


-- 5. TABLA DE RESEÑAS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Ajustado a 5 estrellas
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, anime_id) -- Un usuario solo puede dejar 1 review por anime
);

CREATE INDEX idx_reviews_anime ON public.reviews(anime_id);


-- 6. ENUM PARA WATCHLIST
CREATE TYPE watchlist_status AS ENUM ('watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch');

-- 7. TABLA DE WATCHLIST
CREATE TABLE public.watchlists (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
  status watchlist_status NOT NULL DEFAULT 'plan_to_watch',
  episodes_watched INTEGER DEFAULT 0 CHECK (episodes_watched >= 0),
  user_score INTEGER CHECK (user_score >= 1 AND user_score <= 5), -- Ajustado a 5 estrellas
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, anime_id)
);


-- 8. TABLA DE FAVORITOS
CREATE TABLE public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, anime_id)
);

-- ==========================================
-- TRIGGERS Y FUNCIONES AUTOMÁTICAS
-- ==========================================

-- Función que se ejecuta cuando un usuario se registra en Supabase Auth
-- y crea automáticamente su perfil público en `profiles`.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    -- Generamos un username temporal basado en su email o un id
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que escucha a auth.users (la tabla interna de Supabase)
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) BÁSICO
-- ==========================================
-- Activamos RLS en todas las tablas para seguridad
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (Cualquiera puede leer estos datos)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Animes are viewable by everyone." ON public.animes FOR SELECT USING (true);
CREATE POLICY "Follows are viewable by everyone." ON public.follows FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Watchlists are viewable by everyone." ON public.watchlists FOR SELECT USING (true);
CREATE POLICY "Favorites are viewable by everyone." ON public.favorites FOR SELECT USING (true);

-- Políticas de escritura (Solo el usuario dueño puede editar/borrar sus propios datos)
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own follows." ON public.follows FOR ALL USING (auth.uid() = follower_id);
CREATE POLICY "Users can manage their own reviews." ON public.reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own watchlists." ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites." ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Para los animes, de momento permitimos inserción autenticada 
-- (ya que la app insertará el anime en la DB cuando alguien interactúe con él si no existe)
CREATE POLICY "Authenticated users can insert animes" ON public.animes FOR INSERT TO authenticated WITH CHECK (true);
