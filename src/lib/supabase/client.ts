import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient({
  options: {
    cookies: {
      name: 'sb-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: 'localhost',
      path: '/',
      sameSite: 'lax'
    }
  }
}) 