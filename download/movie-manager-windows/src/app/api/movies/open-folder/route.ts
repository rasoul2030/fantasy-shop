import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';

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
      // Normalize Windows path separators
      const normalizedPath = folderPath.replace(/\//g, '\\');
      // Use 'start' command which is more reliable on Windows
      // The empty title "" prevents issues with paths containing spaces
      command = `start "" "${normalizedPath}"`;
    } else if (platform === 'darwin') {
      command = `open "${folderPath}"`;
    } else {
      command = `xdg-open "${folderPath}"`;
    }

    try {
      await execAsync(command, { timeout: 5000 });
    } catch {
      // Fallback for Windows: try explorer directly
      if (platform === 'win32') {
        const normalizedPath = folderPath.replace(/\//g, '\\');
        await execAsync(`explorer "${normalizedPath}"`, { timeout: 5000 });
      } else {
        throw new Error('Failed to open folder');
      }
    }

    return NextResponse.json({ success: true, message: `Opened: ${folderPath}` });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to open folder';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}