'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-[#FFF] p-6">
      <div className="bg-[#1A1A1A] p-8 rounded-xl max-w-md w-full text-center shadow-lg border border-[#333]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">¡Oops! Algo salió mal.</h2>
        <p className="text-[#BBB] text-sm mb-6 whitespace-pre-line">
          {error.message || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#FFED70] text-[#000] font-bold py-2 px-6 rounded-md hover:bg-[#ffe135] transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
