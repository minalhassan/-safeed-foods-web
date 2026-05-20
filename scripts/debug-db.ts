import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Checking database...");
  const { data: slides, error: sErr } = await supabase.from("HeroSlide").select("*");
  console.log("HeroSlides:", slides, sErr);

  const { data: announcements, error: aErr } = await supabase.from("Announcement").select("*");
  console.log("Announcements:", announcements, aErr);

  const { data: settings, error: seErr } = await supabase.from("StoreSettings").select("*");
  console.log("StoreSettings:", settings, seErr);
}

checkDb();
