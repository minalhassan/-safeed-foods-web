import 'dotenv/config';
import { createAdminClient } from '../src/lib/supabase/admin';

async function main() {
  console.log("Initializing Supabase admin client...");
  
  try {
    const supabase = createAdminClient();
    console.log("Checking buckets...");
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error("❌ Error listing buckets:", listError.message);
      return;
    }
    
    console.log("Current buckets in Supabase:", buckets.map(b => b.name));
    
    const uploadsBucket = buckets.find(b => b.name === 'uploads');
    if (uploadsBucket) {
      console.log("✅ 'uploads' bucket already exists!");
      return;
    }
    
    console.log("Creating 'uploads' bucket...");
    const { data: createData, error: createError } = await supabase.storage.createBucket('uploads', {
      public: true,
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.error("❌ Error creating bucket:", createError.message);
      console.error(createError);
      return;
    }
    
    console.log("✅ 'uploads' bucket created successfully!", createData);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

main();
