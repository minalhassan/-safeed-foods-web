import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    // Check if we have Supabase Service Role Key to upload to Supabase Storage
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (hasServiceKey) {
      const supabase = createAdminClient();
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 1. Try to ensure the 'uploads' bucket exists and is public
      try {
        await supabase.storage.createBucket('uploads', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      } catch (bucketError) {
        // Ignore "already exists" error
      }

      // 2. Upload the file to the 'uploads' bucket
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

      // 3. Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(uniqueName);

      return NextResponse.json({
        success: true,
        url: publicUrl,
      });
    } else {
      // Fallback for local development if SUPABASE_SERVICE_ROLE_KEY is not defined
      console.log("⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Falling back to local disk upload.");
      
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
