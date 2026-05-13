const SUPABASE_URL = 'https://qaddoizqtfthsuducrtr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nAM30iEvX8CxF7ka63R6RA_j0MeziSY';

// Initialize the Supabase Client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Listen to auth state changes
window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);
    if (event === 'SIGNED_IN') {
        // Fetch user profile from public.users
        const { data: profile } = await window.supabaseClient
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        if (profile) {
            localStorage.setItem('ck2_current_user', JSON.stringify(profile));
            // Trigger app UI update if needed
            if (window.App && typeof window.App.updateUserUI === 'function') {
                window.App.updateUserUI();
            }
        }
    } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('ck2_current_user');
        if (window.App && typeof window.App.showLanding === 'function') {
            window.App.showLanding();
        }
    }
});
