import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://lldynbzwdypmtffxpafy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZHluYnp3ZHlwbXRmZnhwYWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzQxMjQsImV4cCI6MjA5MzI1MDEyNH0.9mfj-RMCkGaYaUDTUJggUdClleKIbsfCTUR7t0LTgLw' // de public/anon key uit Project Settings → API
)

const { data, error } = await supabase.auth.signInWithPassword({
    email: 'your@email.com',
    password: 'yourpassword',
})

console.log('Token:', data.session?.access_token)
