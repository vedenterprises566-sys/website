// Transfer all products from catalog.json to Google Spreadsheet via Apps Script
// Run with: node scripts/transfer-to-sheet.js

const fs = require('fs');
const path = require('path');

const APPS_SCRIPT_URL = process.env.VITE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzrggQItVkhV9fhT851L-rRYEvQ9BZG30ew2YXkuDojt5JJ0R09hXt-XaPs5bMV0TP3oQ/exec';

async function main() {
  const catalogPath = path.join(__dirname, '..', 'public', 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('catalog.json not found at', catalogPath);
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log(`Found ${catalog.length} products in catalog.json`);

  // First, fetch what's already in the sheet
  let existingNames = new Set();
  try {
    const listRes = await fetch(`${APPS_SCRIPT_URL}?action=list&t=${Date.now()}`);
    if (listRes.ok) {
      const existing = await listRes.json();
      if (Array.isArray(existing)) {
        existing.forEach(p => {
          if (p.name) existingNames.add(p.name.toLowerCase().trim());
        });
        console.log(`Sheet already has ${existing.length} products`);
      }
    }
  } catch (e) {
    console.warn('Could not fetch existing sheet products:', e.message);
  }

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < catalog.length; i++) {
    const product = catalog[i];
    const name = (product.name || '').trim();

    // Skip if already in sheet
    if (existingNames.has(name.toLowerCase())) {
      console.log(`[${i + 1}/${catalog.length}] SKIP (already in sheet): "${name}"`);
      skipped++;
      continue;
    }

    // Prepare payload
    const payload = {
      action: 'add',
      id: product.id || '',
      name: name,
      category: product.category || 'fancy',
      categoryLabel: product.categoryLabel || '',
      countOrDenier: product.countOrDenier || '',
      description: product.description || '',
      recommendedUses: Array.isArray(product.recommendedUses)
        ? product.recommendedUses.join(', ')
        : (product.recommendedUses || ''),
      features: Array.isArray(product.features)
        ? product.features.join(', ')
        : (product.features || ''),
      sampleAvailable: product.sampleAvailable !== false ? 'TRUE' : 'FALSE',
      origin: product.origin || 'Ved Enterprises',
      popularFor: product.popularFor || '',
      imageUrl: product.imageUrl || product.pictureUrl || product.image || '',
      shadeCardUrl: product.shadeCardUrl || product.shadeUrl || '',
      badge: product.badge || '',
    };

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`[${i + 1}/${catalog.length}] Added: "${name}"`);
        added++;
      } else {
        console.log(`[${i + 1}/${catalog.length}] Response for "${name}":`, data);
        added++;
      }
    } catch (err) {
      console.error(`[${i + 1}/${catalog.length}] FAILED: "${name}" -`, err.message);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n========================================');
  console.log(`Transfer complete!`);
  console.log(`  Added: ${added}`);
  console.log(`  Skipped (already in sheet): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${catalog.length}`);
  console.log('========================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
