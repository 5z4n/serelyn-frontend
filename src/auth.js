import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const isConfigured = () => {
  const url = (SUPABASE_URL || "").trim();
  return url.length > 0 && !url.includes("your-project") && (SUPABASE_ANON_KEY || "").length > 0;
};

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

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

export { isConfigured as isSupabaseConfigured };
export default supabase;
