import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

const isValidUrl = (url) => {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const hasValidConfig = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'your_anon_key'

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseAdmin = hasValidConfig && supabaseServiceKey && supabaseServiceKey !== 'your_service_key'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export { hasValidConfig }
