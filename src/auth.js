import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ──────────────────────────────────────────────────────────
// Add your keys to a .env file in the project root:
//   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

// ─── Sign up a new user ───────────────────────────────────────────────────────
// Returns { data: { user, session }, error }
export const signUp = (email, password) =>
    supabase.auth.signUp({ email, password });

// ─── Sign in an existing user ─────────────────────────────────────────────────
// Returns { data: { user, session }, error }
export const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

// ─── Sign out the current user ────────────────────────────────────────────────
export const signOut = () => supabase.auth.signOut();

// ─── Get current session (useful for persisting login on refresh) ─────────────
export const getSession = () => supabase.auth.getSession();

export default supabase;