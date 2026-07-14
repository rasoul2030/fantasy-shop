import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const movie = await db.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    const folderPath = movie.folderPath;
    if (!folderPath) {
      return NextResponse.json({ error: 'No folder path set for this movie' }, { status: 400 });
    }

    const platform = process.platform;
    let command: string;
    if (platform === 'win32') {
      command = `explorer "${folderPath}"`;
    } else if (platform === 'darwin') {
      command = `open "${folderPath}"`;
    } else {
      command = `xdg-open "${folderPath}"`;
    }

    await execAsync(command);
    return NextResponse.json({ success: true, message: `Opened: ${folderPath}` });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to open folder';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}