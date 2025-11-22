// supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.48.0/+esm";

const supabaseUrl = "https://hctnddkzfckjghfaylac.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdG5kZGt6ZmNramdoZmF5bGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTM5OTMsImV4cCI6MjA3ODg2OTk5M30.N2jUghtaIml1P4rgeC__f3W_5RtYmFl0ESX5LoOWTBc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Expose globally for console debugging
window.supabase = supabase;

/* -----------------------------------------------------
   Helper: get current user (returns null if logged out)
----------------------------------------------------- */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("getCurrentUser error:", error);
    return null;
  }
  return data?.user ?? null;
}

/* -----------------------------------------------------
   Save score (insert or update)
   - Now safely attaches user_id if logged in
----------------------------------------------------- */
export async function saveScoreToSupabase(name, score, level, existingId = null) {
  const safeName = name && name.trim() ? name.trim() : "Guest";

  // NEW: get auth user ID (null if guest)
  const user = await getCurrentUser();
  const userId = user ? user.id : null;

  const payload = {
    name: safeName,
    score,
    level,
    user_id: userId,   // 👈 attaches user_id when logged in
  };

  let query;

  if (existingId) {
    // Update existing row
    query = supabase
      .from("scores")
      .update(payload)
      .eq("id", existingId)
      .select("id")
      .single();
  } else {
    // Insert new row
    query = supabase
      .from("scores")
      .insert(payload)
      .select("id")
      .single();
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase save error:", error);
    throw error;
  }

  return data.id;
}

/* -----------------------------------------------------
   Leaderboard fetch (unchanged)
----------------------------------------------------- */
export async function fetchTopScores(limit = 15) {
  const { data, error } = await supabase
    .from("scores")
    .select("id, name, score, level, created_at")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase fetch leaderboard error:", error);
    throw error;
  }

  return data;
}

/* -----------------------------------------------------
   Auth helpers (optional)
----------------------------------------------------- */
export async function signup(email, password) {
  return await supabase.auth.signUp({ email, password });
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function logout() {
  return await supabase.auth.signOut();
}
