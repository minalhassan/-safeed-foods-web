import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

async function addSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables in .env file.");
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Check if the admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'admin@safeed.com')
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error checking admin user in Supabase:", checkError.message);
      console.error(checkError);
      return;
    }

    if (existingAdmin) {
      console.log("ℹ️ Admin user already exists in Supabase:");
      console.log(`- ID: ${existingAdmin.id}`);
      console.log(`- Email: ${existingAdmin.email}`);
      console.log(`- Role: ${existingAdmin.role}`);
      
      // Update password to ensure it matches rabby1122
      console.log("Updating admin password to 'rabby1122'...");
      const { data: updatedAdmin, error: updateError } = await supabase
        .from('User')
        .update({
          password: 'rabby1122',
          role: 'ADMIN',
          name: 'Admin'
        })
        .eq('email', 'admin@safeed.com')
        .select('*')
        .single();
        
      if (updateError) {
        console.error("❌ Failed to update admin password:", updateError.message);
      } else {
        console.log("✅ Admin user password updated successfully!");
      }
      return;
    }

    // 2. Insert the admin user if not exists
    console.log("Creating admin user in Supabase...");
    const { data: newAdmin, error: insertError } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        name: 'Admin',
        email: 'admin@safeed.com',
        phone: '01800000000',
        password: 'rabby1122',
        role: 'ADMIN',
        address: 'Admin Office'
      })
      .select('*')
      .single();

    if (insertError) {
      console.error("❌ Failed to insert admin user into Supabase:", insertError.message);
      console.error(insertError);
      return;
    }

    console.log("✅ Admin user created successfully in Supabase!");
    console.log(`- ID: ${newAdmin.id}`);
    console.log(`- Email: ${newAdmin.email}`);
    console.log(`- Role: ${newAdmin.role}`);
  } catch (error) {
    console.error("❌ An unexpected error occurred:", error);
  }
}

addSupabaseAdmin();
