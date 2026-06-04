import { ProfileService } from '@/services/profile.service'
import Link from 'next/link'
import { UserSearchInput } from '@/components/profile/UserSearchInput'
import { UserListGrid } from '@/components/profile/UserListGrid'
import { createClient } from '@/lib/supabase/server'

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const page = parseInt(resolvedParams.page || '1', 10) || 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let users: any[] = []
  let followStatuses: Record<string, boolean> = {}
  let hasNextPage = false

  if (query) {
    const res = await ProfileService.searchUsers(query, page)
    users = res.data
    hasNextPage = res.hasNextPage
    
    if (user && users.length > 0) {
      const userIds = users.map(u => u.id)
      followStatuses = await ProfileService.getFollowingStatusesBatch(user.id, userIds)
    }
  }

  return (
    <main className="min-h-screen bg-[#121212] pt-[120px] pb-[80px]">
      <div className="max-w-[800px] mx-auto px-[32px] md:px-[56px] w-full">
        
        <div className="text-center mb-[40px]">
          <h1 className="text-[32px] font-bold text-[#FFFFFF] mb-[12px]">Find Users</h1>
          <p className="text-[#888] text-[15px]">Search for other anime fans by their username.</p>
        </div>

        <UserSearchInput initialQuery={query} />

        {query && users.length === 0 && (
          <div className="text-center py-[60px] text-[#555] text-[15px]">
            No users found matching "{query}".
          </div>
        )}

        {users.length > 0 && (
          <>
            <UserListGrid 
              users={users} 
              currentUserId={user?.id || null} 
              followStatuses={followStatuses} 
            />
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-[12px] mt-[40px]">
              {page > 1 ? (
                <Link href={`/usuarios?q=${encodeURIComponent(query)}&page=${page - 1}`} className="px-[20px] py-[10px] bg-[#222] text-[#FFF] rounded-[8px] font-semibold hover:bg-[#333] transition-colors no-underline">
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
                <Link href={`/usuarios?q=${encodeURIComponent(query)}&page=${page + 1}`} className="px-[20px] py-[10px] bg-[#222] text-[#FFF] rounded-[8px] font-semibold hover:bg-[#333] transition-colors no-underline">
                  Next
                </Link>
              ) : (
                <span className="px-[20px] py-[10px] bg-[#111] text-[#555] rounded-[8px] font-semibold cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          </>
        )}

      </div>
    </main>
  )
}
