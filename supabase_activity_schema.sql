-- ==========================================
-- FASE 9: FEED SOCIAL DE ACTIVIDAD (v2)
-- Guardamos un log de qué hacen los usuarios 
-- para mostrarlo en el muro de "Actividad de Seguidos"
-- ==========================================

-- 1. ENUM para los tipos de acciones
CREATE TYPE activity_type AS ENUM (
  'review_created',
  'added_to_favorites',
  'watchlist_updated'
);

-- 2. TABLA DE ACTIVIDADES
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
  action_type activity_type NOT NULL,
  
  -- Usamos JSONB para guardar metadatos extra dependiendo de la acción.
  -- Ej: si es un review, guardamos el rating. Si es watchlist, el nuevo status.
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para obtener rápidamente el feed de un usuario y ordenarlo
CREATE INDEX idx_activities_user_created ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_activities_anime ON public.activities(anime_id);

-- RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities are viewable by everyone." ON public.activities FOR SELECT USING (true);


-- ==========================================
-- TRIGGERS PARA AUTOMATIZAR LA CREACIÓN DE ACTIVIDADES
-- ==========================================

-- A) Trigger para cuando se crea una REVIEW
CREATE OR REPLACE FUNCTION public.log_review_activity()
RETURNS trigger AS $$
BEGIN
  -- Solo insertamos si es una nueva review (INSERT).
  -- Podríamos hacerlo en UPDATE también, pero saturaría el feed.
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.activities (user_id, anime_id, action_type, metadata)
    VALUES (NEW.user_id, NEW.anime_id, 'review_created', jsonb_build_object('rating', NEW.rating, 'review_id', NEW.id));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created_activity ON public.reviews;
CREATE TRIGGER on_review_created_activity
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.log_review_activity();


-- B) Trigger para cuando se añade a FAVORITOS
CREATE OR REPLACE FUNCTION public.log_favorite_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.activities (user_id, anime_id, action_type)
  VALUES (NEW.user_id, NEW.anime_id, 'added_to_favorites');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_favorite_created_activity ON public.favorites;
CREATE TRIGGER on_favorite_created_activity
  AFTER INSERT ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.log_favorite_activity();


-- C) Trigger para cuando se actualiza la WATCHLIST
CREATE OR REPLACE FUNCTION public.log_watchlist_activity()
RETURNS trigger AS $$
BEGIN
  -- Si es la primera vez que lo añade o si cambió el estado
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status)) THEN
    INSERT INTO public.activities (user_id, anime_id, action_type, metadata)
    VALUES (
      NEW.user_id, 
      NEW.anime_id, 
      'watchlist_updated', 
      jsonb_build_object('status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_watchlist_changed_activity ON public.watchlists;
CREATE TRIGGER on_watchlist_changed_activity
  AFTER INSERT OR UPDATE ON public.watchlists
  FOR EACH ROW EXECUTE FUNCTION public.log_watchlist_activity();
