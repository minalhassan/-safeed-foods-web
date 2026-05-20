import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "কোনো ফাইল পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${cleanName}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                        process.env.SUPABASE_ANON_KEY || 
                        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload the file to the 'uploads' bucket directly using the anon/service key
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('uploads')
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(uniqueName);

      return NextResponse.json({
        success: true,
        url: publicUrl,
      });
    } else {
      // Fallback for local development if no credentials at all are found (unlikely)
      console.log("⚠️ No Supabase credentials found in environment. Falling back to local disk upload.");
      
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public", "uploads");

      // Ensure the folder exists
      await mkdir(uploadDir, { recursive: true });

      // Write file to disk
      const filePath = join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueName}`,
      });
    }
  } catch (error: any) {
    console.error("❌ File upload handler failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "সার্ভারে ফাইল আপলোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
