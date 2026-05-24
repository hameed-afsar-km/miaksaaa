import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error: "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.",
        },
        { status: 500 }
      );
    }

    const data = await request.formData();
    const file = data.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Prepare parameters for signature
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "products";

    const params: Record<string, string> = {
      folder,
      timestamp: timestamp.toString(),
    };

    // Sort keys and generate signature
    const sortedKeys = Object.keys(params).sort();
    const signatureString =
      sortedKeys.map((key) => `${key}=${params[key]}`).join("&") + apiSecret;

    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Build the request to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary upload error:", result);
      return NextResponse.json(
        { error: result.error?.message || "Failed to upload to Cloudinary" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err: any) {
    console.error("Upload API route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
