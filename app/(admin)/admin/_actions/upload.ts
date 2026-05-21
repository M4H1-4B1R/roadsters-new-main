"use server";

import { adminDb } from "@/lib/supabase/admin";

const BUCKET = "image";

function sanitizePath(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function ensureBucket(): Promise<string | null> {
  const { error } = await adminDb.storage.createBucket(BUCKET, {
    public: true,
  });
  if (error && !error.message.toLowerCase().includes("already exists")) {
    return error.message;
  }
  return null;
}

export default async function uploadImage(
  file: File,
  folder?: string
): Promise<{ url: string } | { error: string }> {
  try {
    const bucketError = await ensureBucket();
    if (bucketError) return { error: bucketError };

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "bin";
    const basename = sanitizePath(file.name.replace(/\.[^.]+$/, ""));
    const filename = `${timestamp}-${basename}.${ext}`;
    const path = `${sanitizePath(folder || "uploads")}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await adminDb.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) return { error: uploadError.message };

    const { data } = adminDb.storage.from(BUCKET).getPublicUrl(path);

    return { url: data.publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }
}
