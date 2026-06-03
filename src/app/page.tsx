import { AnimeCard } from '@/components/anime/AnimeCard'
import { Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AnimeService } from '@/services/anime.service'
import { JikanAnime } from '@/types/anime'

export default async function Home() {
  const topAnimesResponse = await AnimeService.getTopAnimes(1);
  const seasonalAnimesResponse = await AnimeService.getSeasonalAnimes(1);

  const topAnimes = topAnimesResponse?.data?.slice(0, 10) || [];
  const seasonalAnimes = seasonalAnimesResponse?.data?.slice(0, 10) || [];

  const featuredAnime = seasonalAnimes.length > 0 ? seasonalAnimes[0] : topAnimes[0];

  const mapToCard = (anime: JikanAnime) => ({
    id: anime.mal_id,
    title: anime.title,
    year: anime.year || new Date().getFullYear(),
    rating: (anime.score || 0) / 2,
    imageUrl: anime.images.webp.large_image_url
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212' }}>
      {/* ==================== HERO SECTION ==================== */}
      {featuredAnime && (
        <section className="hero-section">
          {/* Background Image */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              src={
                featuredAnime.trailer?.images?.maximum_image_url
                || featuredAnime.trailer?.images?.large_image_url
                || featuredAnime.images.jpg?.large_image_url
                || featuredAnime.images.webp.large_image_url
              }
              alt="Hero Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
              }}
            />
            {/* Gradient overlays */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                background: `
                  linear-gradient(to bottom, rgba(18,18,18,0) 0%, rgba(18,18,18,0.6) 55%, #121212 100%),
                  linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0) 65%)
                `,
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="hero-content-wrapper">
            <div style={{ maxWidth: '540px' }}>
              {/* Badge "Destacado" */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#1E2B1E',
                  color: '#6BCB77',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '20px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6BCB77' }} />
                Featured
              </div>

              <h1 className="hero-title">
                {featuredAnime.title}
              </h1>

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#C0C0C0',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <span>{featuredAnime.year || new Date().getFullYear()}</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#666' }} />
                <span>{featuredAnime.episodes || '??'} Episodes</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#666' }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#FFED70' }}>★</span>
                  <span style={{ color: '#FFF' }}>{((featuredAnime.score || 0) / 2).toFixed(1)}</span>
                </span>
              </div>

              {/* Synopsis */}
              <p
                style={{
                  color: '#B0B0B0',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                  maxWidth: '480px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {featuredAnime.synopsis || "No synopsis available."}
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link href={`/anime/${featuredAnime.mal_id}`}>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '0 24px',
                      height: '42px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} /> Watch Now
                  </button>
                </Link>
                <Link href={`/anime/${featuredAnime.mal_id}`}>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#2A2A2A',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '14px',
                      padding: '0 20px',
                      height: '42px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    More Info <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== ANIMES POPULARES ==================== */}
      <section className="section-popular">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>Popular Anime</h2>
          <Link
            href="/buscar"
            style={{
              color: '#FFED70',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
            }}
          >
            View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
          </Link>
        </div>

        <div className="anime-grid-5">
          {topAnimes.slice(0, 5).map((anime: JikanAnime) => (
            <AnimeCard key={`top-${anime.mal_id}`} {...mapToCard(anime)} />
          ))}
        </div>
      </section>

      {/* ==================== ANIMES DE TEMPORADA ==================== */}
      <section className="section-seasonal">
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
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>Seasonal Anime</h2>
          </div>
          <Link
            href="/buscar"
            style={{
              color: '#FFED70',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              paddingBottom: '4px',
            }}
          >
            View all <ChevronRight style={{ width: '16px', height: '16px', opacity: 0.7 }} />
          </Link>
        </div>

        <div className="anime-grid-5">
          {seasonalAnimes.slice(0, 5).map((anime: JikanAnime, index: number) => (
            <AnimeCard key={`temp-${anime.mal_id}-${index}`} {...mapToCard(anime)} />
          ))}
        </div>
      </section>
    </div>
  )
}
