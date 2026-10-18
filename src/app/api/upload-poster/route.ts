import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, WebP, or GIF.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueName = `poster-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Check if we're on Vercel (has BLOB_READ_WRITE_TOKEN)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob Storage
      const blob = await put(uniqueName, file, {
        access: 'public',
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url, name: uniqueName });
    }

    // Fallback: local filesystem (for development)
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const postersDir = path.join(process.cwd(), 'public', 'posters');
    await mkdir(postersDir, { recursive: true });
    const filePath = path.join(postersDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/posters/${uniqueName}`, name: uniqueName });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
