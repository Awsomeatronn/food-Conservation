export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date))
}

export function formatDateOnly(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date))
}

export function getTimeRemaining(expiresAt: string | Date): {
  label: string
  status: 'fresh' | 'soon' | 'expired'
  hoursLeft: number
} {
  const now = Date.now()
  const exp = new Date(expiresAt).getTime()
  const diffMs = exp - now
  const diffHrs = diffMs / (1000 * 60 * 60)
  const diffMins = diffMs / (1000 * 60)

  if (diffMs <= 0) {
    return { label: 'Expired', status: 'expired', hoursLeft: 0 }
  }
  if (diffMins < 60) {
    return {
      label: `${Math.floor(diffMins)}m left`,
      status: 'soon',
      hoursLeft: diffHrs,
    }
  }
  if (diffHrs < 3) {
    return {
      label: `${Math.floor(diffHrs)}h ${Math.floor(diffMins % 60)}m left`,
      status: 'soon',
      hoursLeft: diffHrs,
    }
  }
  if (diffHrs < 24) {
    return {
      label: `${Math.floor(diffHrs)}h left`,
      status: 'fresh',
      hoursLeft: diffHrs,
    }
  }
  const days = Math.floor(diffHrs / 24)
  return {
    label: `${days}d ${Math.floor(diffHrs % 24)}h left`,
    status: 'fresh',
    hoursLeft: diffHrs,
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

export async function uploadFile(
  supabase: ReturnType<typeof import('@/lib/supabase/client').createClient>,
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
