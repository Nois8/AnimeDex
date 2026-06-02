import Link from 'next/link'
import { Star } from 'lucide-react'

export interface AnimeCardProps {
  id: string | number;
  title: string;
  year: number;
  rating: number;
  imageUrl: string;
}

export function AnimeCard({ id, title, year, rating, imageUrl }: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`} style={{ display: 'flex', flexDirection: 'column', gap: '10px', textDecoration: 'none' }}>
      {/* Image container — forced square with padding trick for consistent sizing */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#202020',
        }}
      >
        <img 
          src={imageUrl} 
          alt={`Cover of ${title}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
      </div>
      
      {/* Card info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            margin: 0,
          }}
          title={title}
        >
          {title}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#999', gap: '8px' }}>
          <span>{year}</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#555', flexShrink: 0 }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star style={{ width: '12px', height: '12px', fill: '#FFED70', color: '#FFED70', flexShrink: 0 }} />
            <span style={{ color: '#FFFFFF' }}>{rating.toFixed(1)}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
