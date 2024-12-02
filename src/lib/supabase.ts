import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);

console.log("SUPABASE_URL:", import.meta.env.PUBLIC_SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
