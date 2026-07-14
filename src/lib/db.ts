import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient, type Client } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db';

  if (dbUrl.startsWith('libsql://')) {
    // Turso / remote libSQL
    const libsql: Client = createClient({ url: dbUrl });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // Local SQLite file
  return new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;