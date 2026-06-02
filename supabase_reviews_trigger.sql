-- ==========================================
-- FASE 5: SISTEMA DE PUNTUACIONES
-- Trigger para actualizar `average_score` y `total_reviews` 
-- automáticamente en la tabla de animes.
-- ==========================================

-- 1. Creamos la función que recalcula los promedios
CREATE OR REPLACE FUNCTION public.recalculate_anime_score()
RETURNS trigger AS $$
BEGIN
  -- Si es un INSERT o UPDATE, recalculamos usando el anime_id de la nueva fila (NEW)
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE public.animes
    SET 
      average_score = (
        SELECT COALESCE(ROUND(AVG(rating), 2), 0) 
        FROM public.reviews 
        WHERE anime_id = NEW.anime_id
      ),
      total_reviews = (
        SELECT COUNT(*) 
        FROM public.reviews 
        WHERE anime_id = NEW.anime_id
      )
    WHERE id = NEW.anime_id;
  
  -- Si es un DELETE, usamos el anime_id de la fila vieja (OLD)
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.animes
    SET 
      average_score = (
        SELECT COALESCE(ROUND(AVG(rating), 2), 0) 
        FROM public.reviews 
        WHERE anime_id = OLD.anime_id
      ),
      total_reviews = (
        SELECT COUNT(*) 
        FROM public.reviews 
        WHERE anime_id = OLD.anime_id
      )
    WHERE id = OLD.anime_id;
  END IF;

  RETURN NULL; -- Los triggers AFTER devuelven NULL
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asignamos la función al trigger en la tabla de reviews
-- Usamos DROP TRIGGER IF EXISTS por si lo ejecutas varias veces
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;

CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_anime_score();
