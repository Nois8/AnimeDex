import { AnimeCard } from '@/components/anime/AnimeCard'
import { Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AnimeService } from '@/services/anime.service'
import { JikanAnime } from '@/types/anime'

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = parseInt(resolvedParams.page || '1', 10) || 1;

  let searchResults: JikanAnime[] = [];
  let hasNextPage = false;
  let topAnimes: JikanAnime[] = [];
  let seasonalAnimes: JikanAnime[] = [];
  let allAnimes: JikanAnime[] = [];

  if (query) {
    const res = await AnimeService.searchAnimes(query, page);
    searchResults = res?.data || [];
    hasNextPage = res?.pagination?.has_next_page || false;
  } else {
    const [topRes, seasonRes] = await Promise.all([
      AnimeService.getTopAnimes(1),
      AnimeService.getSeasonalAnimes(1)
    ]);
    topAnimes = topRes?.data?.slice(0, 5) || [];
    seasonalAnimes = seasonRes?.data?.slice(0, 5) || [];
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
      <div className="section-popular" style={{ marginBottom: '48px', paddingBottom: 0, paddingTop: 0 }}>
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
        <section className="section-popular" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Results for &quot;{query}&quot;
              <span style={{ fontSize: '14px', fontWeight: 400, color: '#666' }}>({searchResults.length})</span>
            </h2>
          </div>
          {searchResults.length > 0 ? (
            <>
              <div className="anime-grid-5">
                {searchResults.map((anime: JikanAnime) => (
                  <AnimeCard key={`search-${anime.mal_id}`} {...mapToCard(anime)} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-[12px] mt-[40px]">
                {page > 1 ? (
                  <Link href={`/buscar?q=${encodeURIComponent(query)}&page=${page - 1}`} className="px-[20px] py-[10px] bg-[#222] text-[#FFF] rounded-[8px] font-semibold hover:bg-[#333] transition-colors no-underline">
                    Previous
                  </Link>
                ) : (
                  <span className="px-[20px] py-[10px] bg-[#111] text-[#555] rounded-[8px] font-semibold cursor-not-allowed">
                    Previous
                  </span>
                )}
                
                <span className="text-[#888] font-medium px-[8px]">
                  Page {page}
                </span>

                {hasNextPage ? (
                  <Link href={`/buscar?q=${encodeURIComponent(query)}&page=${page + 1}`} className="px-[20px] py-[10px] bg-[#222] text-[#FFF] rounded-[8px] font-semibold hover:bg-[#333] transition-colors no-underline">
                    Next
                  </Link>
                ) : (
                  <span className="px-[20px] py-[10px] bg-[#111] text-[#555] rounded-[8px] font-semibold cursor-not-allowed">
                    Next
                  </span>
                )}
              </div>
            </>
          ) : (
            <div style={{ color: '#666', textAlign: 'center', padding: '80px 0', fontSize: '15px' }}>
              No results found for &quot;{query}&quot;.
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ==================== ANIMES POPULARES ==================== */}
          <section className="section-popular" style={{ paddingTop: 0, paddingBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Popular Anime</h2>
              <Link href="/buscar" style={verTodosStyle}>
                View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
              </Link>
            </div>
            <div className="anime-grid-5">
              {topAnimes.map((anime: JikanAnime) => (
                <AnimeCard key={`pop-${anime.mal_id}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>

          {/* ==================== ANIMES DE TEMPORADA ==================== */}
          <section className="section-popular" style={{ paddingTop: 0, paddingBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            <div className="anime-grid-5">
              {seasonalAnimes.map((anime: JikanAnime, index: number) => (
                <AnimeCard key={`temp-${anime.mal_id}-${index}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>

          {/* ==================== TODOS LOS ANIMES ==================== */}
          <section className="section-popular" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                All Anime
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#666' }}>({allAnimes.length})</span>
              </h2>
              <Link href="/buscar" style={verTodosStyle}>
                View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
              </Link>
            </div>
            <div className="anime-grid-5">
              {allAnimes.map((anime: JikanAnime, index: number) => (
                <AnimeCard key={`all-${anime.mal_id}-${index}`} {...mapToCard(anime)} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
