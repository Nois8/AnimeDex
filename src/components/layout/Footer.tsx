import Link from 'next/link'
import { Heart, Globe, MessageCircle, Gamepad2, Mail } from 'lucide-react'

export function Footer() {
  const linkStyle = { color: '#808080', textDecoration: 'none', fontSize: '13px' }
  const iconStyle = { width: '18px', height: '18px', color: '#808080' }

  return (
    <footer style={{ width: '100%', backgroundColor: '#1A1A1A', paddingTop: '56px', paddingBottom: '24px', marginTop: 'auto' }}>
      <div className="footer-grid">
        {/* Brand & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFED70' }}>AnimeDex</span>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FFED70', borderRadius: '2px' }} />
          </Link>
          <p style={{ color: '#808080', fontSize: '13px', lineHeight: 1.6, maxWidth: '320px', margin: 0 }}>
            Tu plataforma definitiva para descubrir, valorar y compartir tus animes favoritos con una comunidad apasionada.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '4px' }}>
            <Link href="#"><Globe style={iconStyle} /></Link>
            <Link href="#"><MessageCircle style={iconStyle} /></Link>
            <Link href="#"><Gamepad2 style={iconStyle} /></Link>
            <Link href="#"><Mail style={iconStyle} /></Link>
          </div>
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Navegación</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link href="/" style={linkStyle}>Inicio</Link></li>
            <li><Link href="/buscar" style={linkStyle}>Explorar</Link></li>
            <li><Link href="/perfil" style={linkStyle}>Mi Perfil</Link></li>
            <li><Link href="#" style={linkStyle}>Comunidad</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link href="#" style={linkStyle}>Términos de servicio</Link></li>
            <li><Link href="#" style={linkStyle}>Política de privacidad</Link></li>
            <li><Link href="#" style={linkStyle}>Cookies</Link></li>
            <li><Link href="#" style={linkStyle}>Contacto</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p style={{ margin: 0 }}>© 2024 AnimeHub. Todos los derechos reservados.</p>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Hecho con <Heart style={{ width: '12px', height: '12px', color: '#FFED70', fill: '#FFED70' }} /> para la comunidad anime
        </p>
      </div>
    </footer>
  )
}
