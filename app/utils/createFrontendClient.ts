import { createClient } from "@supabase/supabase-js";
import { Database } from "@/app/types/database.types";

export function createFrontendClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
