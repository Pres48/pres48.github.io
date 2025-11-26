// Supabase project keys for Day Facts
const SUPABASE_URL = "https://zhunbfqtxnccpcrrnkir.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpodW5iZnF0eG5jY3BjcnJua2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzU4MzMsImV4cCI6MjA3OTc1MTgzM30.t-wbLgnrOY7f65M8oIQMn07UB7IHYs-dwlRuNhs5mso";

// Create Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
