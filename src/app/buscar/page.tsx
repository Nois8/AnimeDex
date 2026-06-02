import { AnimeCard } from '@/components/anime/AnimeCard'
import { Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AnimeService } from '@/services/anime.service'
import { JikanAnime } from '@/types/anime'

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  let searchResults: JikanAnime[] = [];
  let topAnimes: JikanAnime[] = [];
  let seasonalAnimes: JikanAnime[] = [];
  let allAnimes: JikanAnime[] = [];

  if (query) {
    const res = await AnimeService.searchAnimes(query);
    searchResults = res?.data || [];
  } else {
    const [topRes, seasonRes] = await Promise.all([
      AnimeService.getTopAnimes(1),
      AnimeService.getSeasonalAnimes(1)
    ]);
    topAnimes = topRes?.data?.slice(0, 5) || [];
    seasonalAnimes = seasonRes?.data?.slice(0, 5) || [];
    // "Todos los Animes" combines both lists without duplicates
    const seenIds = new Set<number>();
    const combined: JikanAnime[] = [];
    for (const anime of [...topRes?.data || [], ...seasonRes?.data || []]) {
      if (!seenIds.has(anime.mal_id)) {
        seenIds.add(anime.mal_id);
        combined.push(anime);
      }
    }
    allAnimes = combined.slice(0, 20);
  }

  const mapToCard = (anime: JikanAnime) => ({
    id: anime.mal_id,
    title: anime.title,
    year: anime.year || new Date().getFullYear(),
    rating: (anime.score || 0) / 2,
    imageUrl: anime.images.webp.large_image_url
  });

  const sectionStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 56px',
    width: '100%',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: '20px',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  };

  const verTodosStyle = {
    color: '#FFED70',
    fontSize: '13px',
    fontWeight: 500 as const,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    textDecoration: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212', paddingTop: '100px', paddingBottom: '80px' }}>
      {/* ==================== SEARCH BAR ==================== */}
      <div style={{ ...sectionStyle, marginBottom: '48px' }}>
        <form action="/buscar" method="GET" style={{ position: 'relative', maxWidth: '460px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              width: '18px',
              height: '18px',
            }}
          />
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search anime..." 
            style={{
              width: '100%',
              backgroundColor: '#1E1E1E',
              border: '1px solid #2A2A2A',
              borderRadius: '6px',
              padding: '14px 20px 14px 48px',
              color: '#FFFFFF',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </form>
      </div>

      {query ? (
        /* ==================== SEARCH RESULTS ==================== */
        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Results for &quot;{query}&quot;
              <span style={{ fontSize: '14px', fontWeight: 400, color: '#666' }}>({searchResults.length})</span>
            </h2>
          </div>
          {searchResults.length > 0 ? (
            <div style={gridStyle}>
              {searchResults.map((anime) => (
                <AnimeCard key={`search-${anime.mal_id}`} {...mapToCard(anime)} />
              ))}
            </div>
          ) : (
            <div style={{ color: '#666', textAlign: 'center', padding: '80px 0', fontSize: '15px' }}>
              No results found for &quot;{query}&quot;.
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ==================== ANIMES POPULARES ==================== */}
          <section style={{ ...sectionStyle, marginBottom: '56px' }}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Popular Anime</h2>
              <Link href="/buscar" style={verTodosStyle}>
                View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
              </Link>
            </div>
            <div style={gridStyle}>
              {topAnimes.map((anime) => (
                <AnimeCard key={`pop-${anime.mal_id}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>

          {/* ==================== ANIMES DE TEMPORADA ==================== */}
          <section style={{ ...sectionStyle, marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Season badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    backgroundColor: '#1E2B1E',
                    color: '#6BCB77',
                    fontSize: '12px',
                    fontWeight: 500,
                    marginBottom: '12px',
                    width: 'fit-content',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6BCB77' }} />
                  Spring 2026
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Seasonal Anime</h2>
              </div>
              <Link href="/buscar" style={{ ...verTodosStyle, paddingBottom: '4px' }}>
                View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
              </Link>
            </div>
            <div style={gridStyle}>
              {seasonalAnimes.map((anime, index) => (
                <AnimeCard key={`temp-${anime.mal_id}-${index}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>

          {/* ==================== TODOS LOS ANIMES ==================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                All Anime
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#666' }}>({allAnimes.length})</span>
              </h2>
              <Link href="/buscar" style={verTodosStyle}>
                View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
              </Link>
            </div>
            <div style={gridStyle}>
              {allAnimes.map((anime, index) => (
                <AnimeCard key={`all-${anime.mal_id}-${index}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
