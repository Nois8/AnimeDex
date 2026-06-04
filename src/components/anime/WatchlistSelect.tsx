'use client'

import { useState, useTransition } from 'react'
import { WatchlistStatus } from '@/types/lists'
import { updateWatchlistAction } from '@/controllers/list.controller'
import { ChevronDown, Plus } from 'lucide-react'
import Link from 'next/link'

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
  externalId,
  isLoggedIn = false
}: { 
  animeId: string; 
  initialStatus?: WatchlistStatus;
  externalId: string;
  isLoggedIn?: boolean;
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

  if (!isLoggedIn) {
    return (
      <Link href="/login" style={{ textDecoration: 'none' }}>
        <button className="inline-flex items-center gap-[8px] bg-[#FFED70] text-[#000] font-bold text-[14px] px-[24px] h-[42px] rounded-[6px] cursor-pointer border-none hover:bg-[#e6d565] transition-colors">
          <Plus className="w-[16px] h-[16px]" /> Añadir a lista
        </button>
      </Link>
    )
  }

  return (
    <div className="relative inline-block">
      <select
        className="inline-flex items-center gap-[8px] bg-[#FFED70] text-[#000] font-bold text-[14px] pl-[24px] pr-[40px] h-[42px] rounded-[6px] cursor-pointer border-none outline-none appearance-none hover:bg-[#e6d565] transition-colors disabled:opacity-50"
        value={status}
        onChange={handleChange}
        disabled={isPending}
      >
        {STATUS_OPTIONS.map((opt: { value: string, label: string }) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A1A] text-[#FFF] font-medium">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-[14px] top-[13px] pointer-events-none text-[#000]">
        <ChevronDown className="w-[16px] h-[16px]" />
      </div>
    </div>
  )
}
