@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Migrate Data to Turso

echo.
echo  ========================================
echo    Migrating local data to Turso
echo  ========================================
echo.
echo  Usage: migrate-to-turso.bat libsql://your-db.turso.io?authToken=xxx
echo.

if "%~1"=="" (
    echo  ERROR: Provide your Turso URL as argument!
    echo  Example: migrate-to-turso.bat "libsql://mydb-myorg.turso.io?authToken=abc123"
    pause
    exit /b 1
)

cd /d "%~dp0"

echo  Exporting data from local SQLite...
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const movies = await prisma.movie.findMany({ include: { categories: { include: { category: true } } } });
  const categories = await prisma.category.findMany();
  require('fs').writeFileSync('migrate-data.json', JSON.stringify({ movies, categories }, null, 2));
  console.log('Exported:', movies.length, 'movies,', categories.length, 'categories');
}
main().then(() => prisma.\$disconnect()).catch(e => { console.error(e); process.exit(1); });
" 2>&1

if not exist migrate-data.json (
    echo  ERROR: Export failed!
    pause
    exit /b 1
)

echo  Importing data to Turso...
set DATABASE_URL=%~1
npx prisma db push --accept-data-loss 2>&1

npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');
const data = require('./migrate-data.json');

async function main() {
  const libsql = createClient({ url: process.env.DATABASE_URL });
  const adapter = new PrismaLibSql(libsql);
  const prisma = new PrismaClient({ adapter });

  // Create categories
  for (const cat of data.categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, type: cat.type },
      create: { id: cat.id, name: cat.name, slug: cat.slug, type: cat.type },
    });
  }
  console.log('Categories imported:', data.categories.length);

  // Create movies
  for (const movie of data.movies) {
    const { categories, ...movieData } = movie;
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: movieData,
      create: {
        ...movieData,
        categories: categories.map(c => ({ categoryId: c.categoryId })),
      },
    });
  }
  console.log('Movies imported:', data.movies.length);
}
main().then(() => prisma.\$disconnect()).catch(e => { console.error(e); process.exit(1); });
" 2>&1

del migrate-data.json

echo.
echo  ========================================
echo    Migration complete!
echo  ========================================
echo.
pause