import { AnimeService } from '@/services/anime.service'

export default async function TestBackendPage() {
  // 1. Probamos a buscar "Naruto" en la API externa (Jikan)
  const searchResult = await AnimeService.searchAnimes('Naruto', 1)
  
  // 2. Simulamos que el usuario hizo click en "Naruto" (ID de MAL: 20)
  // Esto debería disparar nuestra lógica que lo guarda en Supabase.
  const savedAnime = await AnimeService.getAnimeByExternalId(20)

  // 3. Probamos a traer los animes populares
  const topAnimes = await AnimeService.getTopAnimes(1)

  return (
    <main className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-6">🧪 Test de Integración del Backend</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 bg-blue-100 p-2">1. Anime guardado en Supabase (Naruto)</h2>
        <p className="mb-2 text-gray-600">
          Si ves datos aquí, significa que la API de Jikan funcionó, se conectó a tu Supabase y guardó el anime en tu tabla <code>animes</code> exitosamente. Ve a ver tu base de datos en Supabase después de cargar esta página.
        </p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(savedAnime, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 bg-purple-100 p-2">2. Resultados de Búsqueda (Jikan API)</h2>
        <pre className="bg-slate-900 text-purple-400 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(searchResult?.data?.slice(0, 2), null, 2)}
        </pre>
      </section>

    </main>
  )
}
