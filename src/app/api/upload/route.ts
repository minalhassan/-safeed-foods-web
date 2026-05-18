import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to remove special chars, keeping english letters, numbers, and extension
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${cleanName}`;

    // Path to public/uploads
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
  } catch (error) {
    console.error("❌ Direct file upload handler failed:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভারে ফাইল আপলোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
