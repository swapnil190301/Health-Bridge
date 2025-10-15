import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nqkpjafnawqmrakrsuhw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xa3BqYWZuYXdxbXJha3JzdWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjM2MzgsImV4cCI6MjA3NDg5OTYzOH0.PKppS81VEJHW-GwjsEG1dVyRHGrNhYgHxKLJjHglekU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 