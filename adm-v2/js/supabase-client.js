const SUPABASE_URL = 'https://qaddoizqtfthsuducrtr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nAM30iEvX8CxF7ka63R6RA_j0MeziSY';

// Initialize the Supabase Client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
