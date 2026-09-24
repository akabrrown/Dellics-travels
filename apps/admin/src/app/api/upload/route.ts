import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    // For now, since Cloudinary SDK is not installed and we don't have a guaranteed upload preset,
    // we return the base64 data URI so the image displays immediately in the UI and saves in DB
    const dataURI = `data:${file.type};base64,${base64}`;
    
    return NextResponse.json({ 
      url: dataURI 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
