const { createClient } = require('@libsql/client');

const url = process.argv[2];
const token = process.argv[3];
if (!url) {
  console.error('Usage: node push-turso.js <libsql-url> <auth-token>');
  process.exit(1);
}

const client = createClient({ url, authToken: token });

async function main() {
  console.log('Connecting to Turso...');

  // Drop old tables first to ensure clean schema
  try { await client.execute(`DROP TABLE IF EXISTS "MovieCategory"`); } catch {}
  try { await client.execute(`DROP TABLE IF EXISTS "Movie"`); } catch {}
  try { await client.execute(`DROP TABLE IF EXISTS "Category"`); } catch {}
  console.log('✓ Old tables dropped');

  await client.execute(`
    CREATE TABLE "Category" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'movie',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Category table created');

  await client.execute(`
    CREATE TABLE "Movie" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "code" TEXT,
      "slug" TEXT NOT NULL,
      "description" TEXT,
      "posterUrl" TEXT,
      "folderPath" TEXT,
      "year" INTEGER,
      "ageRating" TEXT,
      "status" TEXT NOT NULL DEFAULT 'completed',
      "episodeInfo" TEXT,
      "subType" TEXT,
      "rating" REAL,
      "featured" BOOLEAN NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Movie_slug_key" UNIQUE("slug")
    );
  `);
  console.log('✓ Movie table created');

  await client.execute(`
    CREATE TABLE "MovieCategory" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "movieId" TEXT NOT NULL,
      "categoryId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "MovieCategory_movieId_categoryId_key" UNIQUE("movieId", "categoryId"),
      FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  console.log('✓ MovieCategory table created');

  console.log('\nAll tables created successfully on Turso!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });