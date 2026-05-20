import 'dotenv/config';
import { createAdminClient } from '../src/lib/supabase/admin';

async function main() {
  console.log("Connecting to Supabase database...");
  try {
    const supabase = createAdminClient();
    console.log("Checking if 'HeroSlide' table exists...");
    
    const { data, error } = await supabase
      .from("HeroSlide")
      .select("*");
      
    if (error) {
      console.error("❌ Error querying 'HeroSlide' table:", error.message);
      console.error("Code:", error.code);
      return;
    }
    
    console.log("✅ 'HeroSlide' table exists!");
    console.log("Number of slides in database:", data.length);
    console.log("Slide data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

main();
