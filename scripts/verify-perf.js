// Performance Optimization Script
// This script verifies the optimizations applied to the project

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const checks = [
  {
    name: 'framer-motion removed from all components',
    check: () => {
      const srcDir = path.join(process.cwd(), 'src');
      const files = execSync(`rg -l "framer-motion" "${srcDir}" 2>/dev/null`).toString().trim();
      return files.length === 0 ? 'PASS' : `FAIL: ${files}`;
    }
  },
  {
    name: 'Dynamic imports in page.tsx',
    check: () => {
      const content = fs.readFileSync('src/app/page.tsx', 'utf8');
      const hasDynamic = content.includes('next/dynamic');
      const hasLazyAdmin = content.includes("dynamic(() => import('@/components/AdminPanel')");
      return hasDynamic && hasLazyAdmin ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'Cache headers on categories API',
    check: () => {
      const content = fs.readFileSync('src/app/api/categories/route.ts', 'utf8');
      return content.includes('Cache-Control') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'Cache headers on movies API',
    check: () => {
      const content = fs.readFileSync('src/app/api/movies/route.ts', 'utf8');
      return content.includes('Cache-Control') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'loading.tsx exists',
    check: () => {
      return fs.existsSync('src/app/loading.tsx') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'Font preload in layout.tsx',
    check: () => {
      const content = fs.readFileSync('src/app/layout.tsx', 'utf8');
      return content.includes('preload') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'Image lazy loading in MovieCard',
    check: () => {
      const content = fs.readFileSync('src/components/MovieCard.tsx', 'utf8');
      return content.includes('loading="lazy"') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'No duplicate .dark CSS variables',
    check: () => {
      const content = fs.readFileSync('src/app/globals.css', 'utf8');
      const hasDarkBlock = content.includes('.dark {');
      // The .dark block was removed since it was identical to :root
      return !hasDarkBlock ? 'PASS' : 'FAIL (still has .dark block)';
    }
  },
  {
    name: 'CSS animations defined',
    check: () => {
      const content = fs.readFileSync('src/app/globals.css', 'utf8');
      return content.includes('card-entrance') && content.includes('prefers-reduced-motion') ? 'PASS' : 'FAIL';
    }
  },
  {
    name: 'poweredByHeader disabled',
    check: () => {
      const content = fs.readFileSync('next.config.ts', 'utf8');
      return content.includes('poweredByHeader: false') ? 'PASS' : 'FAIL';
    }
  },
];

console.log('=== Performance Optimization Verification ===\n');
let passed = 0;
let failed = 0;
for (const c of checks) {
  const result = c.check();
  const status = result === 'PASS' ? '✅' : '❌';
  console.log(`${status} ${c.name}`);
  if (result !== 'PASS') {
    console.log(`   ${result}`);
    failed++;
  } else {
    passed++;
  }
}
console.log(`\n${passed}/${checks.length} checks passed`);