'use client'

import { useState, useTransition } from 'react'
import { WatchlistStatus } from '@/types/lists'
import { updateWatchlistAction } from '@/controllers/list.controller'

const STATUS_OPTIONS: { value: WatchlistStatus | ''; label: string }[] = [
  { value: '', label: 'Añadir a lista' },
  { value: 'watching', label: 'Viendo' },
  { value: 'plan_to_watch', label: 'Plan para ver' },
  { value: 'completed', label: 'Completado' },
  { value: 'on_hold', label: 'En pausa' },
  { value: 'dropped', label: 'Abandonado' }
]

export function WatchlistSelect({ 
  animeId, 
  initialStatus, 
  externalId 
}: { 
  animeId: string; 
  initialStatus?: WatchlistStatus;
  externalId: string;
}) {
  const [status, setStatus] = useState<WatchlistStatus | ''>(initialStatus || '')
  const [isPending, startTransition] = useTransition()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as WatchlistStatus | ''
    const prevStatus = status
    
    setStatus(newStatus)
    
    if (newStatus === '') return; // Posiblemente podríamos hacer un remove_action, pero por ahora ignoramos

    startTransition(async () => {
      const formData = new FormData()
      formData.append('animeId', animeId)
      formData.append('externalId', externalId)
      formData.append('status', newStatus)

      const result = await updateWatchlistAction(formData)
      if (result.error) {
        setStatus(prevStatus)
        alert(result.error)
      }
    })
  }

  return (
    <select
      className="h-12 px-4 rounded-[4px] bg-[#202020] text-gray-300 border-none outline-none focus:ring-1 focus:ring-[#FFED70]/50 appearance-none cursor-pointer disabled:opacity-50 text-[14px] font-medium"
      value={status}
      onChange={handleChange}
      disabled={isPending}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
