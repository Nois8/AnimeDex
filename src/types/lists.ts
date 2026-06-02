export type WatchlistStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

export interface WatchlistEntry {
  user_id: string
  anime_id: string
  status: WatchlistStatus
  episodes_watched: number
  user_score?: number
  updated_at: string
}

export interface WatchlistUpdateParams {
  animeId: string
  userId: string
  status?: WatchlistStatus
  episodesWatched?: number
  userScore?: number
}
