import { supabase } from "./lib/supabase";

console.log("Testing Supabase connection...");

// Test basic connection
supabase
  .from("admin_users")
  .select("*")
  .eq("email", "vignezhm@gmail.com")
  .then(({ data, error }) => {
    console.log("Admin user check:", { data, error });
  });

// Test auth state
supabase.auth.getSession().then(({ data, error }) => {
  console.log("Current session:", { data, error });
});

export {};
