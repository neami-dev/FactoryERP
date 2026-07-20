import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const name: string | null = data.get("name") as unknown as string;

  if (!file || !name) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const fileExtension = path.extname(file.name);
  const fileType = fileExtension.slice(1);
  const fileName = `${Date.now()}-${name}.${fileType}`;
 

  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);
  
  return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
}
